import React, { useEffect, useState } from 'react'
import { Form, Button, ButtonGroup, ToggleButton } from 'react-bootstrap'
const VakForm = ({
	post,
	setPost,
	initialValue,
	categories,
	maxHeight,
	onSubmit,
	submitText,
	submitDisabled }) => {

	const handleTextAreaKeyDown = (e) => {
		e.target.style.height = 'inherit';
		e.target.style.height = `${e.target.scrollHeight}px`;
	}

	const [disabled, setDisabled] = useState();
	useEffect(() => {
		console.log(post)
		console.log(!post || !post.content || !post.categoryId || !post.title
			|| post.content === '' || post.title === '' || post.categoryId === -1)
		if (!post || !post.content || !post.categoryId || !post.title
			|| post.content === '' || post.title === '' || post.categoryId === -1) {
			setDisabled(true);
		}
		else {
			setDisabled(false);
		}
	}, [post]);

	const [option, setOption] = useState("option2");

	var id = "string"

	const handleOptionChange = (event) => {
		const selectedOption = event.target.value;
		setOption(selectedOption);			
	};

	const handleTest = (event) => {
		console.log(post)
	};

	return (
		<Form>
			<Button
				onClick={handleTest}
			>Test</Button>
			<Form.Group className="mb-3">
				<Form.Control
					className='p-3'
					type='text'
					placeholder='Название компании'
					defaultValue={!!initialValue ? initialValue.companyName : ''}
					required
					onChange={e => setPost({ ...post, companyName: e.target.value })}
				/>
			</Form.Group >
			<Form.Group className="mb-3">
				<Form.Control
					className='p-3'
					type='text'
					placeholder='Название'
					defaultValue={!!initialValue ? initialValue.title : ''}
					required
					onChange={e => setPost({ ...post, title: e.target.value })}
				/>
			</Form.Group>
			<Form.Select
				className='p-3'
				onChange={e => setPost({ ...post, categoryId: e.target.value })}
				defaultValue={!!initialValue ? initialValue.categoryId : -1}
			>
				<option hidden value>Категория</option>
				{categories.map(cat =>
					<option key={cat.id} value={cat.id}>{cat.name}</option>)}
			</Form.Select>
			<Form.Group className="mb-3">
				<Form.Control
					className='p-3'
					type='text'
					placeholder='Зарплата'
					defaultValue={!!initialValue ? initialValue.salary : ''}
					required
					onChange={e => setPost({ ...post, salary: e.target.value })}
				/>
			</Form.Group>            
			<Form.Group className="mt-3 mb-3">
				<Form.Control
					style={{ maxHeight: maxHeight }}
					onChange={e => setPost({ ...post, description: e.target.value })}
					className='p-3'
					as="textarea"
					placeholder="Описание"
					defaultValue={!!initialValue ? initialValue.description : ''}
					onKeyDown={handleTextAreaKeyDown}
					required
				/>
			</Form.Group>
            <Form.Group className="mt-3 mb-3">
				<Form.Control
					style={{ maxHeight: maxHeight }}
					onChange={e => setPost({ ...post, content: e.target.value })}
					className='p-3'
					as="textarea"
					placeholder="Содержание"
					defaultValue={!!initialValue ? initialValue.content : ''}
					onKeyDown={handleTextAreaKeyDown}
					required
				/>
			</Form.Group>
			<Button
				variant="outline-primary"
				onClick={onSubmit}
			>
				{submitText}
			</Button>
		</Form>
	)
}

export default VakForm