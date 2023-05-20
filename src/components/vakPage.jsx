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
import EditVakForm from "./EditVakForm";
import UsersService from "../api/UsersService";


const VakPage = () => {

    const [post, setPost] = useState({});
    const [feeded, setFedded] = useState([]);
    const [categories, setCategories] = useState([]);
    const [comments, setComments] = useState([]);

    const { user } = useContext(AuthContext);
    const params = useParams();

    const navigate = useNavigate();
    const location = useLocation();

    const [isPostDeleted, setIsPostDeleted] = useState(false);
    const subtitleFontSize = '14px';

    const [showEditPostModal, setShowEditPostModal] = useState(false);
    const handleEditPostModalClose = () => setShowEditPostModal(false);
    const handleEditPostModalOpen = () => setShowEditPostModal(true);

    const [showVakOtklicModal, setShowVakOtklicModal] = useState(false);
    const handleVakOtklicModalClose = () => setShowVakOtklicModal(false);

    const [fetchPost, isPostLoading, postError] = useFetching(async (id) => {
        const response = await PostsService.getById(id);
        setPost(response.data);
    })
    const array = []
    const [fetchPostFeed] = useFetching(async (id) => {
        console.log("Шаг 1")
        const response = await PostsService.getByIdFeed(id);
        const newFeeded = [];
        for (let i = 0; i < response.data.length; i++) {
            const data = response.data[i];
            const feed = {};
            feed.id = data.applicationUser.id;
            feed.name = data.applicationUser.userName;
            newFeeded.push(feed);
        }
        setFedded(newFeeded);
        console.log("feeded")
        console.log(feeded)
    })
    //getByIdFeed
    const [fetchCategories, isCategoriesLoading, categoriesError] = useFetching(async () => {
        const response = await CategoriesService.getAll();
        return response;
    })

    const [feed, setFeed] = useState();
    const [feedED, setFeedED] = useState();

    const [fetchFeed] = useFetching(async (feed) => {
        const response = await PostsService.postFeed(feed);
        return response
    })

    const handleFeed = async (e) => {
        setFeedED({ ...feed, id: "string", postId: post.id, applicationUserId: user.id })
        await fetchFeed(feedED)
    }

    useEffect(() => {
        const fetchAPI = async () => {
            await fetchCategories();
            await fetchPost(params.id);
            // await fetchComments(params.id);
        };
        fetchAPI();
    }, []);

    useEffect(() => {
        if (postError && (postError.response.status === 404
            || params.id === null
            || !params.id
        )) {
            navigate('/not-found', { replace: true })
        }
    }, [params.id, postError]);

    const [show, setShow] = useState(false);

    const navigation = useNavigate();

    const [expanded, setExpanded] = useState(false);

    const handleClose = async () => {
        setShow(false);
        setExpanded(false);
        navigate(-1)
    }

    const isEditAllowed = useEditAllow(post);
    const handleDelete = async () => {
        if (isEditAllowed) {
            //console.log("Зашли")
            await PostsService.deletePost(post.id)
            //console.log("PostDelete")
            setShow(true);
        }
    }

    const [isAdmin, setIsAdmin] = useState(false);
    const [isUser, setIsUser] = useState(false);

    useEffect(() => {
        if (user && user.role === 'Admin') {
            setIsAdmin(true);
        }
        else {
            setIsAdmin(false);
        }
    }, [user])

    useEffect(() => {
        if (user && user.role === 'Admin') {
            setIsUser(false);
        }
        else {
            setIsUser(true);
        }
    }, [user])

    const [userFeed, setUserFeed] = useState([{}]);

    const handleVakOtklicModalOpen = () => {
        fetchPostFeed(post.id)
        //fetchuUserFeed(renderData())
        setShowVakOtklicModal(true);
        console.log("result")
        console.log(userFeed)
    }

    // const myArray = []
    // const newArray = myArray.concat(userFeed)

    // function userFeedData() {
    //     const name = newArray.map(item => item)
    //     return name
    // }

    const handleClick = () => {
        console.log("")
    }


    return (
        <>
            {/* <Button onClick={handleClick} >Test</Button> */}
            {
                isPostDeleted ?
                    <Card className="m-3 p-3">
                        Пост удалён
                    </Card>

                    : isPostLoading
                        ? <Loader />
                        : <>
                            <Card border='dark' className='m-3'>
                                <Card.Header className="d-flex justify-content-between">
                                    <div>
                                        <Card.Subtitle
                                            className="m-2 text-muted"
                                            style={{ cursor: "pointer", fontSize: subtitleFontSize }}
                                            onClick={() => navigate(`/users/${post.applicationUserId}`, {
                                                state: { from: location }
                                            })}
                                        >

                                        </Card.Subtitle>
                                        <Card.Subtitle
                                            className="m-2 text-muted"
                                            style={{ fontSize: subtitleFontSize }}
                                        >
                                            Опубликовано:
                                            {' ' + formatDate(post.dateCreated)}
                                        </Card.Subtitle>
                                        <Link className="m-2" to={post.category ? `/category/${post.category.id}` : '/'}>
                                            {!!post.category ? post.category.name : 'Нет категории'}
                                        </Link>
                                    </div>
                                    {
                                        isUser &&
                                        <Button
                                            className='m-1'
                                            variant="outline-dark"
                                            onClick={handleFeed}
                                        >
                                            <div className="d-flex justify-content-center">
                                                <h6>Отклик</h6>
                                                <img src={edit} />
                                            </div>
                                        </Button>
                                    }
                                    {
                                        isAdmin &&
                                        <div className="mt-2">
                                            <Button
                                                className='m-1'
                                                variant="outline-dark"
                                                onClick={handleVakOtklicModalOpen}
                                            >
                                                <div className="d-flex justify-content-center">
                                                    <h6>Посмотреть отклики</h6>
                                                    <img src={edit} />
                                                </div>
                                            </Button>
                                            <Button
                                                className='m-1'
                                                variant="outline-dark"
                                                onClick={handleEditPostModalOpen}
                                            >
                                                <div className="d-flex justify-content-center">
                                                    <h6>Изменить</h6>
                                                    <img src={edit} />
                                                </div>
                                            </Button>
                                            <Button
                                                className='m-1'
                                                variant="outline-dark"
                                                onClick={handleDelete}
                                            >
                                                <div className="d-flex justify-content-center">
                                                    <h6>Удалить</h6>
                                                    <img src={_delete} />
                                                </div>
                                            </Button>
                                        </div>
                                    }
                                </Card.Header>
                                <Card.Body>
                                    <Card>
                                        <Card.Body>
                                            <h3>{post.title}</h3>
                                        </Card.Body>
                                    </Card>
                                    <Card>
                                        <Card.Body>
                                            <h20>Название компании</h20>
                                            <h3>{post.companyName}</h3>
                                        </Card.Body>
                                    </Card>
                                    <Card>
                                        <Card.Body>
                                            <h20>Категррия</h20>
                                            {/* <h5>{categories.map(cat =>{cat.name})}</h5> */}
                                        </Card.Body>
                                    </Card>
                                    <Card>
                                        <Card.Body>
                                            <h20>Зарплата</h20>
                                            <h5>{post.salary}</h5>
                                        </Card.Body>
                                    </Card>
                                    <Card>
                                        <Card.Body>
                                            <h20>Описание</h20>
                                            <h5>{post.description}</h5>
                                        </Card.Body>
                                    </Card>
                                    <Card>
                                        <Card.Body>
                                            <h20>Содержание</h20>
                                            <h5>{post.content}</h5>
                                        </Card.Body>
                                    </Card>
                                </Card.Body>
                            </Card>

                            {
                                <Modal show={show} onHide={handleClose}>
                                    <Modal.Body>Резюме удалено</Modal.Body>
                                    <Modal.Footer>
                                        <Button
                                            variant="secondary"
                                            onClick={handleClose}
                                        >
                                            OK
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            }
                        </>
            }
            <Modal size='lg' show={showEditPostModal} onHide={handleEditPostModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Редактирование записи</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditVakForm
                        categories={categories}
                        initPost={{
                            id: post.id,
                            title: post.title,
                            categoryId: post.categoryId,
                            companyName: post.companyName,
                            salary: post.salary,
                            description: post.description,
                            content: post.content
                        }}
                        onSubmit={async e => {
                            handleEditPostModalClose();
                            await fetchPost(params.id);
                        }}
                        maxHeight={400}
                    />
                </Modal.Body>
            </Modal>
            <Modal size='lg' show={showVakOtklicModal} onHide={handleVakOtklicModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Отклики</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card.Header>
                        {feeded.map(cat =>
                            <Card.Subtitle
                                className="mb-2 text-muted text-sm-left s"
                                style={{ cursor: "pointer", fontSize: subtitleFontSize }}
                                onClick={() => navigate(`/users/${cat.id}`, {
                                    state: { from: location }
                                })}
                            >
                                <Card.Body>Пользователь: {cat.name}</Card.Body>
                            </Card.Subtitle>)}
                    </Card.Header>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default VakPage;