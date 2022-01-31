import mongoose, { mongo } from "mongoose";
import Posting from "../Models/Posting";
import User from "../Models/User"

export const home = async (req, res) => {
    const postings = await Posting.find({});
    return res.render("home", {pageTitle: "홈", postings});
};

export const see = async (req, res) => {
    const { id } = req.params;
    const posting = await Posting.findById(id)

    if (posting) {
        
        await Posting.findByIdAndUpdate(id, { meta: { view: posting.meta.view + 1 } });
        return res.render("see", { pageTitle: "게시물 보기", posting});
    } else {
        return res.render("404", { pageTitle: "삭제됐거나 없는 글 입니다."});
    }
    
};

export const getUpload = (req, res) => {
    const { loggedIn } = req.session;
    if (!loggedIn) {
        return res.redirect("/login");
    }
    return res.render("upload", { pageTitle: "게시물 업로드" });
};

export const postUpload = async (req, res) => {
    const { title, content } = req.body;
    const { username } = req.session.user;
    await Posting.create({
        title,
        content,
        author: username
    });
    return res.redirect("/");
};

export const deletePosting = async (req, res) => {
    const { id } = req.params;
    const posting = await Posting.findById(id);

    if (posting) {
        if (req.session.loggedIn && posting.author == req.session.user.username) {
            await Posting.findByIdAndDelete(id);
            return res.redirect(`/`);
        } else {
            return res.status(404).render("404", {pageTitle: "해당 페이지를 찾을 수 없음"});
        }
        
    } else {
        return res.status(404).render("404", {pageTitle: "삭제됐거나 없는 글 입니다."});
    }
};

export const search = async (req, res) => {
    const { title } = req.query;
    let postings = [];
    if (title) {
        postings = await Posting.find({
            title: {
                $regex: new RegExp(title, 'i')
            }
        });
    } 
    
    
    return res.render("search", {pageTitle: "검색", postings})
};