import React, { useContext, useEffect, useState } from "react";
import PostsService from "../api/PostsService";
import CategoriesService from "../api/CategoriesService";
import { useFetching } from "../hooks/useFetching";
import Loader from "./Loader";
import CommentList from "./CommentList";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { formatDate } from "../utils";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context";
import EditPostForm from "./EditPostForm";
import CommentBlock from "./CommentBlock";
import { useEditAllow } from "../hooks/useEditAllow";
import CommentsService from "../api/CommentsService";
import _delete from "../icons/delete.svg";
import EditCommentForm from "./EditCommentForm";
import edit from "../icons/edit.svg"


const VakPage = () => {

    return (
        <div
            className="modal show"
            style={{ display: 'block', position: 'initial' }}
        >
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Modal body text goes here.</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary">Close</Button>
                    <Button variant="primary">Save changes</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    );
}

export default VakPage;