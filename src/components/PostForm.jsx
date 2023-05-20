import React, { useEffect, useState } from 'react'
import { Form, Button, ButtonGroup, ToggleButton } from 'react-bootstrap'
const PostForm = ({
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
		setPost({ ...post, genderId: option, id: id })		
	};

	const handleTest = (event) => {
		console.log(post)
	};

	return (
		<Form>
			{/* <Button
				onClick={handleTest}А
			>Test</Button> */}
			<Form.Group className="mb-3">
				<Form.Control
					className='p-3'
					type='text'
					placeholder='Имя'
					defaultValue={!!initialValue ? initialValue.name : ''}
					required
					onChange={e => setPost({ ...post, name: e.target.value })}
				/>
			</Form.Group >
			<Form.Group className="mb-3">
				<Form.Control
					className='p-3'
					type='text'
					placeholder='Фамилия'
					defaultValue={!!initialValue ? initialValue.surname : ''}
					required
					onChange={e => setPost({ ...post, surname: e.target.value })}
				/>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Control
					className='p-3'
					type='text'
					placeholder='Отчество'
					defaultValue={!!initialValue ? initialValue.middlename : ''}
					required
					onChange={e => setPost({ ...post, middlename: e.target.value })}
				/>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Check
					type="radio"
					label="Женский"
					name="options"
					id="option1"
					value="18aec81d-b5b0-45f3-1721-8d41560b02f1"
					checked={option === "18aec81d-b5b0-45f3-1721-8d41560b02f1"}
					onChange={handleOptionChange}
				/>
				<Form.Check
					type="radio"
					label="Мужской"
					name="options"
					id="option2"
					value="28aec81d-b5b0-45f3-1721-8d41560b02f1"
					checked={option === "28aec81d-b5b0-45f3-1721-8d41560b02f1"}					
					onChange={handleOptionChange}
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
					placeholder='Номер телефона'
					defaultValue={!!initialValue ? initialValue.phoneNumber : ''}
					required
					onChange={e => setPost({ ...post, phoneNumber: e.target.value })}
				/>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Control
					className='p-3'
					type='text'
					placeholder='Желаемая должность'
					defaultValue={!!initialValue ? initialValue.title : ''}
					required
					onChange={e => setPost({ ...post, title: e.target.value })}
				/>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Control
					className='p-3'
					type='text'
					placeholder='Желаемая зарплата'
					defaultValue={!!initialValue ? initialValue.salary : ''}
					required
					onChange={e => setPost({ ...post, salary: e.target.value })}
				/>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Control
					className='p-3'
					type='text'
					placeholder='Email'
					defaultValue={!!initialValue ? initialValue.email : ''}
					required
					onChange={e => setPost({ ...post, email: e.target.value })}
				/>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Control
					className='p-3'
					type='text'
					placeholder='Опыт работы'
					defaultValue={!!initialValue ? initialValue.workExperience : ''}
					required
					onChange={e => setPost({ ...post, workExperience: e.target.value })}
				/>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Control
					className='p-3'
					type='text'
					placeholder='Образование'
					defaultValue={!!initialValue ? initialValue.education : ''}
					required
					onChange={e => setPost({ ...post, education: e.target.value })}
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
			<Button
				variant="outline-primary"
				onClick={onSubmit}
			>
				{submitText}
			</Button>
		</Form>
	)
}

export default PostForm