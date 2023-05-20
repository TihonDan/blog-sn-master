import React, { useEffect, useState } from "react";
import { Card, Button, CloseButton } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RatingsService from "../api/RatingsService";
import { useAuth } from "../hooks/useAuth";
import { useFetching } from "../hooks/useFetching";
import { formatDate } from "../utils";
import dislike from "../icons/dislike.svg";
import like from "../icons/like.svg";
import PostsService from "../api/PostsService";

const UserItem = ({ post }) => {

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

	useEffect(() => {
        fetchPost(currentPost.id);
	}, [user]);

	const handleTest = () => {
		console.log(currentPost)
	}

	return (
        <Button onClick={handleTest}>Test</Button>
		// <Card
		// 	border='dark'
		// 	className="m-3"
		// >
		// 	<Button onClick={handleTest}>Test</Button>
		// 	<Card.Header>
		// 		<Card.Title>{currentPost.title}</Card.Title>
		// 		<div className="d-flex justify-content-between">
		// 			<div>
		// 				<Card.Subtitle
		// 					className="mb-2 text-muted text-sm-left s"
		// 					style={{ cursor: "pointer", fontSize: subtitleFontSize }}
		// 					onClick={() => navigate(`/users/${currentPost.applicationUserId}`, {
		// 						state: { from: location }
		// 					})}
		// 				>
		// 					Автор: {currentPost.name}
		// 				</Card.Subtitle>
		// 				<Card.Subtitle
		// 					className="mb-2 text-muted"
		// 					style={{ fontSize: subtitleFontSize }}
		// 				>
		// 					Опубликовано:
		// 					{' ' + publishedDate}
		// 				</Card.Subtitle>
		// 			</div> 
		// 		</div>
		// 	</Card.Header>
		// 	<Card.Body
		// 		style={{ cursor: "pointer" }}
		// 		onClick={() => {
		// 			navigate(`/resume/${currentPost.id}`)
		// 		}}
		// 	>
		// 		<Card.Text>
		// 			<span style={{ whiteSpace: 'pre-line' }}>
		// 				{currentPost.description}
		// 			</span>
		// 		</Card.Text>
		// 	</Card.Body>
		// </Card>
	);
}

export default UserItem;