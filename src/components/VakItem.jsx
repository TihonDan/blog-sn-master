import React, { useEffect, useState } from "react";
import { Card, Button, CloseButton, Modal } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RatingsService from "../api/RatingsService";
import { useAuth } from "../hooks/useAuth";
import { useFetching } from "../hooks/useFetching";
import { formatDate } from "../utils";
import dislike from "../icons/dislike.svg";
import like from "../icons/like.svg";
import PostsService from "../api/PostsService";
import UsersService from '../api/UsersService';
import PostItem from "./PostItem";
import UserItem from "./UserItem";

const VakItem = ({ post }) => {

	const { user, userRatings, setUserRatings } = useAuth();

	const [currentPost, setCurrentPost] = useState(post);

	const subtitleFontSize = '12px';
	const location = useLocation();
	const navigate = useNavigate();
	const [publishedDate, setPublishedDate] = useState('');
	const [fetchPost, isPostLoading, fetchPostError] = useFetching(async (id) => {
		//const response = await PostsService.getById(id);
		const response = await PostsService.getByResumeId(id);
		setCurrentPost(response.data);
	})

	useEffect(() => {
		setPublishedDate(formatDate(post.dateCreated))
	}, [currentPost])

	const handleLike = async (status) => {
		if (!user) {
			navigate('/login');
			return;
		}

		const rate = {
			id: currentPost.id + user.id,
			postId: currentPost.id,
			applicationUserId: user.id,
			likeStatus: status,
		};

		const { response, deleted } = await RatingsService.postRating(rate)
		setRating(rate);
		deleteRating(currentPost.id);
		if (deleted) {
			setRating(undefined);
		}
		await fetchPost(currentPost.id);
	}
	const [rating, setRating] = useState();

	useEffect(() => {
		if (rating) {
			addRating(rating);
		}
	}, [rating])
	useEffect(() => {
		if (!userRatings) {
			setRating(undefined)
		}
		if (user && userRatings) {
			for (let r of userRatings) {
				if (r.postId === currentPost.id) {
					setRating(r);
					break;
				}
			}
		}
	}, [user, userRatings]);

	const addRating = (r) => {
		if (userRatings && !userRatings.includes(r))
			setUserRatings([...userRatings, r]);
	}
	const deleteRating = (postId) => {
		const ratings = [...userRatings];
		for (let r of ratings) {
			if (r.postId === postId) {
				ratings.splice(ratings.indexOf(r), 1);
				break;
			}
		}
		setUserRatings(ratings);
	}

	const [isAdmin, setIsAdmin] = useState(false);
	const [isUser, setIsUser] = useState(false);
	const [pageUser, setPageUser] = useState([]);
	const [postFeed, setPostFeed] = useState([[]]);

	const [fetchUser, userLoading, userError] = useFetching(async (id) => {
		const response = await UsersService.getById(id);
		setPageUser(response.data);
	})

	const [test] = useFetching(async => {
		fetchPostFeed(currentPost.id)
		const friends = [];
		for (let i = 0; i < postFeed.feedbacks.length; i++) {
			const data = postFeed.feedbacks[i];
			const feed = {};
			feed.post = data;
			friends.push(feed)
		}
		setPostFeedTest(friends);
	})

	const [fetchPostFeed] = useFetching(async (id) => {
		const responce = await PostsService.getPostsFeedback(id);
		setPostFeed(responce.data);
	})

	useEffect(() => {
		const fetchAPI = async () => {
			await fetchUser(user.id);
			await test();
		}
		fetchAPI();
	}, [pageUser]);

	useEffect(() => {
		if (pageUser && pageUser.role === 'Admin') {
			setIsAdmin(true);
		}
		else {
			setIsAdmin(false);
		}
	}, [pageUser])

	const [postFeedTest, setPostFeedTest] = useState([{}]);

	const [showCreateVakModal, setShowCreateVakModal] = useState(false);
	const handleCreateVakModalClose = () => setShowCreateVakModal(false);
	const handleCreateVakModalOpen = () => {
		console.log('dsfd')
		setShowCreateVakModal(true);
		fetchPostFeed(currentPost.id)
		const friends = [];
		for (let i = 0; i < postFeed.feedbacks.length; i++) {
			const data = postFeed.feedbacks[i];
			const feed = {};
			feed.post = data;
			friends.push(feed)
		}
		setPostFeedTest(friends);
	}

	const handleTest = () => {
		console.log(postFeedTest)
	}

	return (
		<>
			<Card
				border='dark'
				className="m-3"
			>
				<Button onClick={handleTest}>Test</Button>
				<Card.Header>
					<Card.Title>{currentPost.title}</Card.Title>
					<div className="d-flex justify-content-between">
						<div>
							<Card.Subtitle
								className="mb-2 text-muted text-sm-left s"
								style={{ cursor: "pointer", fontSize: subtitleFontSize }}
								onClick={() => navigate(`/users/${currentPost.applicationUserId}`, {
									state: { from: location }
								})}
							>
								Автор: {currentPost.name}
							</Card.Subtitle>
							<Card.Subtitle
								className="mb-2 text-muted"
								style={{ fontSize: subtitleFontSize }}
							>
								Опубликовано:
								{' ' + publishedDate}
							</Card.Subtitle>
						</div>
						{/* <Link to={currentPost.category ? `/category/${currentPost.category.id}` : '/'}>
						{currentPost.category ? currentPost.category.name : 'Нет категории'}    /* Сделать категорию
					</Link> */}
					</div>
				</Card.Header>
				<Card.Body
					style={{ cursor: "pointer" }}
					onClick={() => {
						navigate(`/vak/${currentPost.id}`)
					}}
				>
					<Card.Text>
						<span style={{ whiteSpace: 'pre-line' }}>
							{currentPost.description}
						</span>
					</Card.Text>
				</Card.Body>
				{/* <Card.Footer className="d-flex justify-content-between">
				<div>
					Комментариев: {currentPost.commentsCount}
				</div>
				<div className="d-flex mx-3">
					<Button
						onClick={async () => {
							await handleLike(true)
						}}
						variant="light"
					>
						<img src={like} width='20' height='20' />
					</Button>
					<span
						className="m-2"
						style={rating
							? rating.likeStatus ? { color: 'green' } : { color: 'red' }
							: { color: 'black' }}
					>
						{currentPost.ratingCount}
					</span>
					<Button
						onClick={async () => {
							await handleLike(false)
						}}
						variant="light"
					>
						<img src={dislike} width='20' height='20' />
					</Button>
				</div>
			</Card.Footer> */}
				{
					isAdmin &&
					<Card.Footer>
						<Button
							onClick={handleCreateVakModalOpen}
						>Посмотреть отклики</Button>
					</Card.Footer>
				}
			</Card>
			{
				<Modal show={showCreateVakModal} onHide={handleCreateVakModalClose}>
					<Modal.Header closeButton>
						<Modal.Title>
							Отклики
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{postFeedTest.map(post =>
							<UserItem post = {post.post}/>
						)}
					</Modal.Body>
					<Modal.Footer>

					</Modal.Footer>
				</Modal>
			}
		</>
	);
}

export default VakItem;