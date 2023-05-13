import React, { useContext, useEffect, useState } from "react";
import PostsService from "../api/PostsService";
import CategoriesService from "../api/CategoriesService";
import { useFetching } from "../hooks/useFetching";
import Loader from "../components/Loader";
import CommentList from "../components/CommentList";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { formatDate } from "../utils";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context";
import EditPostForm from "../components/EditPostForm";
import CommentBlock from "../components/CommentBlock";
import { useEditAllow } from "../hooks/useEditAllow";
import CommentsService from "../api/CommentsService";
import _delete from "../icons/delete.svg";
import EditCommentForm from "../components/EditCommentForm";
import edit from "../icons/edit.svg"


const PostPage = () => {

	const [post, setPost] = useState({});
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

	const [fetchPost, isPostLoading, postError] = useFetching(async (id) => {
		const response = await PostsService.getByResumeId(id);
		setPost(response.data);
	})
	//getById
	const [fetchCategories, isCategoriesLoading, categoriesError] = useFetching(async () => {
		const response = await CategoriesService.getAll();
		setCategories(response.data);
	})
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
			console.log("Зашли")
			await PostsService.deleteResume(post.id)
			console.log("PostDelete")
			setShow(true);
		}
	}
	const handleClick = () => {

	}

	return (
		<>
			<Button onClick={() => navigate(-1)} >Test</Button>
			<Modal size='lg' show={showEditPostModal} onHide={handleEditPostModalClose}>
				<Modal.Header closeButton>
					<Modal.Title>Редактирование записи</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<EditPostForm
						categories={categories}
						initPost={{
							id: post.id,
							applicationUserId: post.applicationUserId,
							categoryId: post.categoryId,
							name: post.name,
							surname: post.surname,
							middlename: post.middlename,
							genderId: post.genderId,
							phoneNumber: post.phoneNumber,
							title: post.title,
							salary: post.salary,
							email: post.email,
							workExperience: post.workExperience,
							education: post.education,
							description: post.description,
							dateCreated: post.dateCreated
						}}
						onSubmit={async e => {
							handleEditPostModalClose();
							await fetchPost(params.id);
						}}
						maxHeight={400}
					/>
				</Modal.Body>
			</Modal>
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
										isEditAllowed &&
										<div className="mt-2">											
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
									{/* <h5>{post.surname} {post.name}</h5>										
									<h4>{post.title}</h4>
									<span style={{whiteSpace: 'pre-line'}}>
										{post.content}
									</span> */}
									<Card>
										<Card.Body>
											<h20>Сейчас на сайте</h20>
											<h3>{post.surname} {post.name}</h3>
											<h20>Контакты</h20>
											<h5>{post.phoneNumber} - мобильный телефон</h5>
											<h5>{post.email} - email</h5>
										</Card.Body>
									</Card>
									<Card>
										<Card.Body>
											<h3>{post.title}</h3>
											<h20>Опыт работы</h20>
											<h5>{post.workExperience}</h5>
										</Card.Body>
									</Card>
									<Card>
										<Card.Body>
											<h20>Образование</h20>
											<h5>{post.education}</h5>
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
										//href={`users/${post.applicationUserId}`}										
										// as={Link}
										// to={`users/${user.id}`}
										>
											OK
										</Button>
									</Modal.Footer>
								</Modal>
							}
						</>
			}
		</>
	);
}

export default PostPage;