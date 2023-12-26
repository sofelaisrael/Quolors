import React from 'react'

import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom'

function App() {
	return (
		<div id="co">
			<Outlet />
		</div>
	)
}

export default App
