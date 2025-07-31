import { useState, useEffect } from 'react'

interface DropdownListRetrieveProps {
	retrieveFunction: (query: string) => string[],
	onSelect: (value: string) => void,
	typeDelay: number
}

const DropdownListRetrieve = ({ retrieveFunction, onSelect, typeDelay = 500 } : DropdownListRetrieveProps) => {

	const handleSelect = (option: string) => {
		onSelect(option);
	}

	return (
		<div>DropdownListRetrieve</div>
	)
}

export default DropdownListRetrieve