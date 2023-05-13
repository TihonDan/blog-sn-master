import React, { useState } from 'react'
import { Button, Spinner } from 'react-bootstrap';
import { useSearching } from '../hooks/useSearching';
import { useSorting } from '../hooks/useSorting';
import Loader from './Loader';
import PostFilter from './PostFilter';
import PostList from './PostList'
import PostSearch from './PostSearch';
import ResumeList from './ResumeList';

const ResumeBlock = ({ posts, fetchPosts, isPostsLoading }) => {

	const [filter, setFilter] = useState('');
	const [query, setQuery] = useState('');		

	const handleClick = () => {		
		console.log('One')	
	  }


	return (
		<>
		<div className='d-flex m-3'>		
		</div>
			{
				isPostsLoading ? 
				<div className='m-5 d-flex justify-content-center'>
					<Loader /> 
				</div>
				:
					<ResumeList posts={posts} />
			}
		</>
	)
}

export default ResumeBlock