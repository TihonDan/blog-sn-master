import React, { useEffect, useState } from "react";
import RatingsService from "../api/RatingsService";
import { useFetching } from "../hooks/useFetching";
import { useSorting } from "../hooks/useSorting";
import PostFilter from "./PostFilter";
import VakItem from "./VakItem";

const VakList = ({ posts }) => {

	if (!posts.length) {
		return (
			<h1 style={{ textAlign: 'center', bottom: '20rem' }}>
				Вакансии не обнаружены
			</h1>
		)
	}
	return (
		<>
			{posts.map(post =>
				<VakItem 
					key={post.id} 
					post={post} 
				/>
			)}
		</>
	);
}

export default VakList;