import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminNavBar from './AdminNavBar'
import { CreatePostForm } from "./CreatePostForm";

const AdminPanelLayout = (categories) => {
	return (
		<>
			<AdminNavBar />
			<Outlet />
			{/* <CreatePostForm
						maxHeight={400}
						categories={categories} /> */}
		</>
	)
}

export default AdminPanelLayout