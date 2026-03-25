import React from 'react'
import { Outlet } from 'react-router-dom'
import AuthModal from './Components/AuthModal'
import ColorDetailsModal from './Components/ColorDetailsModal'

function App() {
	return (
		<div id="co">
			<Outlet />
			<AuthModal />
			<ColorDetailsModal />
		</div>
	)
}

export default App
