import mongoose from "mongoose";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import User from "../Models/User";

export const getJoin = (req, res) => {
    return res.render("join", { pageTitle: "가입" });
};

export const postJoin = async (req, res) => {
    const { username, email, password } = req.body;
    const exists = await User.exists({ $or: [{ username }, {email}] });
    if (exists) {
        return res.status(400).render("join", { pageTitle: "가입", errorMessage: "이미 존재하는 유저/이메일 입니다." });
    } else {
        await User.create({
            username, email, password
        });
        req.session.loggedIn = true;
        req.session.user = await User.findOne({username});
        return res.redirect("/");
    }

};

export const getLogin = (req, res) => {
    return res.render("login", { pageTitle: "로그인" });
};

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
        return res.status(400).render("login", { pageTitle: "로그인", errorMessage: "존재하지 않는 유저입니다." });
    }
    if (user.socialOnly) {
        return res.status(400).render("login", { pageTitle: "로그인", errorMessage: "카카오 계정으로 로그인 해주세요." });
    }
    const exist = await bcrypt.compare(password, user.password);

    if (!exist) {
        return res.status(400).render("login", { pageTitle: "로그인", errorMessage: "비밀번호가 일치하지 않습니다." });
    }

    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const startKakaoLogin = (req, res) => {
    const baseUrl = "https://kauth.kakao.com/oauth/authorize?";
    const config = {
        response_type: "code",
        client_id: process.env.KAKAO_CLIENT,
        redirect_uri: process.env.KAKAO_REDIRECT,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = baseUrl + params;
    return res.redirect(finalUrl);
};

export const finishKakaoLogin = async (req, res) => {
    const baseUrl = "https://kauth.kakao.com/oauth/token?";
    const config = {
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_CLIENT,
        redirect_uri: process.env.KAKAO_REDIRECT,
        code: req.query.code,
        client_secret: process.env.KAKAO_SECRET,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = baseUrl + params;
    try {
        const token = await (await fetch(finalUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
        )).json();
        const userData = await(await fetch("https://kapi.kakao.com/v2/user/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token.access_token}`,
            }
        })).json();
        const { profile, email } = userData.kakao_account;
        const existEmail = await User.exists({ email });
        if (existEmail) {
            req.session.loggedIn = true;
            req.session.user = await User.findOne({email});
            return res.redirect("/");
        } else {
            const user = await User.create({
                username: profile.nickname,
                email,
                socialOnly: true,
            });
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
        }
    } catch (error) {
        console.log(error);
        return res.redirect("/login");
    }
    
};

export const getEdit = (req, res) => { 
    return res.render("users/edit-profile", { pageTitle: "프로필 수정" });
};
export const postEdit = async (req, res) => {
    const PATH = "users/edit-profile";
    const pageTitle = "프로필 수정"
    const {
        session: {
            user: { _id }
        },

        body: { username, email },
    } = req;

    if (req.session.user.username != username) {
        const exist = await User.exists({ username });
        if (exist) {
            return res.status(400).render(PATH, {
                pageTitle,
                errorMessage: "이미 존재하는 이름 입니다."
            });
        }
    }
    if (req.session.user.email != email) {
        const exist = await User.exists({ email });
        if (exist) {
            return res.status(400).render(PATH, {
                pageTitle,
                errorMessage: "이미 존재하는 이메일 입니다."
            });
        }
    }

    const updatedUser = await User.findByIdAndUpdate(_id, {
        username, email
    }, { new: true });

    req.session.user = updatedUser;
    return res.redirect("/users/edit");
};
export const getChangePassword = (req, res) => { 
    if (req.session.user.socialOnly) return res.redirect("/");
    return res.render("users/change-password", { pageTitle: "비밀번호 변경" });
};
export const postChangePassword = async (req, res) => { 
    const PATH = "users/change-password";
    const pageTitle = "비밀번호 변경";
    const {
        session: {
            user: { _id, password }
        },

        body: { oldPassword, newPassword, passwordConfirm },
    } = req;

    const ok = await bcrypt.compare(oldPassword, password);

    if (!ok) {
        return res.status(400).render(PATH, {
            pageTitle,
            errorMessage: "현재 비밀번호가 일치하지 않습니다."
        })
    }

    if (newPassword !== passwordConfirm) {
        return res.status(400).render(PATH, {
            pageTitle,
            errorMessage: "새로운 비밀번호가 일치하지 않습니다."
        })
    }

    const user = await User.findById(_id);
    user.password = newPassword;
    await user.save();
    req.session.user.password = user.password;
    return res.redirect("/");
};