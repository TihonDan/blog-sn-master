import React, { useState } from 'react'
import PostsService from '../api/PostsService';
import { useFetching } from '../hooks/useFetching';
import { Card, Form, Button } from 'react-bootstrap';
import VakForm from './VakForm';
import { cutText } from '../utils';
import { useAuth } from '../hooks/useAuth';

export const CreateVakForm = ({ categories, maxHeight, onSubmit = () => null }) => {

	const { user } = useAuth();

	const [post, setPost] = useState({});
	const [createPost, isCreatingLoading, creatingError] = useFetching(async (post) => {
		const response = await PostsService.createPost(post);
		console.log('CreatePostVak post form response:');
		console.log(response);
	})
	const handleCreatePost = async (e) => {
		console.log('Yes')
		e.preventDefault();
	    console.log(post);
		post.id = 0;
        post.applicationUserId = user.id
		//post.description = cutText(post.content, 200);		
		await createPost(post);
	}

	return (
		<>
			<Card className="m-3 p-3">
				<VakForm
					post={post}
					setPost={setPost}
					categories={categories}
					maxHeight={maxHeight}
					submitText='Создать'
					submitDisabled={isCreatingLoading}
					onSubmit={e => {
						handleCreatePost(e);
						onSubmit(e);
					}}
				/>
			</Card>
		</>
	)
}
