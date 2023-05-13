import React, { useState, useEffect } from 'react'
import { Card, Container, Image, Modal, Button } from 'react-bootstrap';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import PostList from '../components/PostList';
import { useFetching } from '../hooks/useFetching';
import AllPostsPage from './AllPostsPage';
import { CreatePostForm } from '../components/CreatePostForm';
import PostsService from '../api/PostsService';
import AuthService from '../api/AuthService';
import { useAuth } from '../hooks/useAuth';
import UsersService from '../api/UsersService';
import VakBlock from '../components/VakBlock';
import ResumeBlock from '../components/ResumeBlock';


const UserPage = () => {

	const params = useParams();
	const navigate = useNavigate();

	const [pageUser, setPageUser] = useState({ userName: '' });
	const [posts, setPosts] = useState([]);

	const [fetchUser, userLoading, userError] = useFetching(async (id) => {
		const response = await UsersService.getById(id);
		setPageUser(response.data);
	})

	//
	useEffect(() => {
		const fetchAPI = async () => {
			await fetchUser(params.id);
			await fetchPosts(params.id);
			await fetchVak(params.id);
		}
		fetchAPI();
	}, [params.id]);
	useEffect(() => {
		if (userError && (userError.response.status === 404
			|| params.id === null
			|| !params.id
		)) {
			navigate('/not-found', { replace: true })
		}
	}, [params.id, userError]);

	const [isAdmin, setIsAdmin] = useState(false);
	const [isUser, setIsUser] = useState(false);

	useEffect(() => {
		if (pageUser && pageUser.role === 'Admin') {
			setIsAdmin(true);
		}
		else {
			setIsAdmin(false);
		}
	}, [pageUser])

	useEffect(() => {
		if (pageUser && pageUser.role === 'Admin') {
			setIsUser(false);
		}
		else {
			setIsUser(true);
		}
	}, [pageUser])

	const [fetchPosts] = useFetching(async (id) => {
		const response = await UsersService.getPostsByUserId(id)
		setPosts(response.data);

	})

	const [fetchVak] = useFetching(async (id) => {
		const response = await UsersService.getResumeByUserId(id)
		setPosts(response.data);

	})

	const [showCreateVakModal, setShowCreateVakModal] = useState(false);
	const handleCreateVakModalClose = () => setShowCreateVakModal(false);
	const handleCreateVakModalOpen = () => {
		setShowCreateVakModal(true);
	}

	const [feeded, setFedded] = useState([]);

	const [fetchPostFeed] = useFetching(async (id) => {
        const response = await UsersService.getFeedByUserId(id);
        const newFeeded = [];
        for (let i = 0; i < response.data.length; i++) {
            const data = response.data[i];
            const feed = {};
            feed.id = data.postId;           
            newFeeded.push(feed);
        }
        setFedded(newFeeded);
        console.log("feeded")
        console.log(feeded)
    })

	const testCheck = () => {
		console.log(pageUser.id)
		fetchPostFeed(pageUser.id)
	}

	return (
		<>
			<Button onClick={testCheck}>test</Button>
			<Card className='p-4 m-3'>
				<h4>
					{pageUser.userName}
				</h4>
				<span style={
					pageUser.role === 'Admin' ? { color: 'green' } : {
						color: 'blue'
					}}>
					{pageUser.role}
				</span>
			</Card>
			{
				isUser &&
				<Card className='mt-3'>
					<Card.Header className='pt-3'>
						<h2>Активные резюме</h2>
					</Card.Header>
					<Button
						onClick={handleCreateVakModalOpen}
					>Посмотреть отклики</Button>
					<Card.Body>
						<ResumeBlock
							fetchPosts={async () => await fetchPosts(params.id)}
							posts={posts}
						/>
					</Card.Body>					
				</Card>
			}
			{
				isAdmin &&
				<Card className='mt-3'>
					<Card.Header className='pt-3'>
						<h2>Активные вакансии</h2>
					</Card.Header>
					<Card.Body>
						<VakBlock
							fetchPosts={async () => await fetchVak(params.id)}
							posts={posts}
						/>
					</Card.Body>
				</Card>
			}
			{
				<Modal show={showCreateVakModal} onHide={handleCreateVakModalClose}>
					<Modal.Header closeButton>
						<Modal.Title>
							Отклики
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Card>
							<Card.Body>Тело карты</Card.Body>
						</Card>
					</Modal.Body>
					<Modal.Footer>

					</Modal.Footer>
				</Modal>
			}
		</>
	)
}

export default UserPage