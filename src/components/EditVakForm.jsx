import React, { useState } from 'react'
import PostsService from '../api/PostsService';
import { useAuth } from '../hooks/useAuth';
import { useEditAllow } from '../hooks/useEditAllow';
import { useFetching } from '../hooks/useFetching';
import { cutText } from '../utils';
import PostForm from './PostForm'
import VakForm from './VakForm';

const EditVakForm = ({ categories, initPost, maxHeight, onSubmit = () => null}) => {

	const [post, setPost] = useState(initPost);

	const [editPost, isEditLoading, editError] = useFetching(async (edittedPost) => {
		console.log(post)
		const response = await PostsService.editPost(edittedPost);
		console.log('EditPostForm edit post response: ');
		console.log(response);
		if (response) {
			await onSubmit();
		}
	})

	const isEditAllowed = useEditAllow(post);

	const handleEdit = async (e) => {	
		e.preventDefault();
		console.log("Попал");
        const tempPost = {...post} 		
		// if (isEditAllowed
		// 	&& post.content && post.content !== '' && post.title && post.title !== '') {
		// 	await editPost(tempPost);
		// }
		await editPost(tempPost);
	}
	return (
		<>
			<VakForm
				post={post}
				setPost={setPost}
				initialValue={initPost}
				categories={categories}
				maxHeight={maxHeight}
				submitDisabled={isEditLoading}
				submitText='Редактировать'
				onSubmit={async e => {
					handleEdit(e);
				}}
			/>
		</>
	)
}

export default EditVakForm