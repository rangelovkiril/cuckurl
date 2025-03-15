import React, { useState, useEffect, useCallback } from 'react'
import { QRCodeCanvas } from 'qrcode.react' // Change the import to use QRCodeCanvas
import './App.css'

function App() {
	const [longUrl, setLongUrl] = useState('')
	const [shortUrl, setShortUrl] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [charCount, setCharCount] = useState(0)
	const [customEnding, setCustomEnding] = useState('')
	const [copied, setCopied] = useState(false)
	const [isValidUrl, setIsValidUrl] = useState(false)
	const [urlPreview, setUrlPreview] = useState(null)
	const [urlHistory, setUrlHistory] = useState([])

	const validateUrl = url => {
		try {
			new URL(url)
			return true
		} catch {
			return false
		}
	}

	const handleUrlChange = e => {
		const url = e.target.value
		setLongUrl(url)
		setIsValidUrl(validateUrl(url))
		if (validateUrl(url)) {
			fetchUrlPreview(url)
		}
	}

	const handleShorten = useCallback(async () => {
		setIsLoading(true)
		setError('')
		try {
			await new Promise(resolve => setTimeout(resolve, 1500))
			if (!longUrl) throw new Error('Please enter a URL')
			if (longUrl.length > 2000) throw new Error('URL is too long')
			const newShortUrl = `https://short.url/${customEnding || 'example'}`
			setShortUrl(newShortUrl)
			// Add to history immediately after successful shortening
			setUrlHistory(prev => [
				{
					long: longUrl,
					short: newShortUrl,
					date: new Date().toISOString()
				},
				...prev.slice(0, 9)
			])
		} catch (err) {
			setError(err.message)
		} finally {
			setIsLoading(false)
		}
	}, [longUrl, customEnding])

	const handleKeyDown = useCallback(
		e => {
			if (e.ctrlKey && e.key === 'Enter') {
				handleShorten()
			}
			if (e.key === 'Escape') {
				setLongUrl('')
				setCustomEnding('')
			}
		},
		[handleShorten]
	)

	const handleCopy = async () => {
		await navigator.clipboard.writeText(shortUrl)
		setCopied(true)
		setTimeout(() => {
			setCopied(false)
		}, 2000)
	}

	const handleShare = platform => {
		const shareUrls = {
			twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shortUrl)}`,
			facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortUrl)}`,
			linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
				shortUrl
			)}`
		}
		window.open(shareUrls[platform], '_blank')
	}

	const handleValidationClick = () => {
		setLongUrl('') // Clear input when X is clicked
	}

	useEffect(() => {
		setCharCount(longUrl.length)
	}, [longUrl])

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [handleKeyDown])

	const fetchUrlPreview = useCallback(async url => {
		try {
			const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`)
			const data = await response.json()
			setUrlPreview(data.data)
		} catch (err) {
			console.error('Failed to fetch preview:', err)
		}
	}, [])

	console.log('Rendering App component')

	return (
		<>
			<header className="header">
				<div className="logo">BulgarTabak</div>
				<nav className="nav">
					<a href="#">URL</a>
					<a href="#">Subscriptions</a>
					<a href="#">Sign Up</a>
					<a href="#">Sign In</a>
				</nav>
			</header>
			<div className="container">
				<main className="main">
					<div className="url-box">
						<h2>Shorten a long URL</h2>
						<div className="input-container">
							<input
								type="text"
								placeholder="Enter long link here"
								value={longUrl}
								onChange={handleUrlChange}
								className={longUrl ? (isValidUrl ? 'valid' : 'invalid') : ''}
							/>
							{longUrl && (
								<div
									className="validation-status"
									onClick={!isValidUrl ? handleValidationClick : undefined}
									title={!isValidUrl ? 'Clear input' : 'Valid URL'}
								>
									{isValidUrl ? '✓' : '×'}
								</div>
							)}
						</div>
						{isValidUrl && urlPreview && (
							<div className="url-preview">
								{urlPreview.image && <img src={urlPreview.image.url} alt="" />}
								<div className="preview-content">
									<h4>{urlPreview.title}</h4>
									<p>{urlPreview.description}</p>
								</div>
							</div>
						)}
						<div className="char-counter">{charCount}/2000</div>
						<div className="custom-ending">
							<input
								type="text"
								placeholder="Custom ending (optional)"
								value={customEnding}
								onChange={e => setCustomEnding(e.target.value)}
							/>
						</div>
						<button onClick={handleShorten} disabled={isLoading}>
							{isLoading ? <span className="loader"></span> : 'Shorten URL'}
						</button>
						{error && <div className="error-message">{error}</div>}
						{shortUrl && (
							<div className="short-url-box">
								<div className="result-section">
									<h3>Shortened URL</h3>
									<div className="url-container">
										<p>{shortUrl}</p>
										<button className="copy-button" onClick={handleCopy}>
											{copied ? '✓ Copied!' : 'Copy'}
										</button>
									</div>
								</div>
								<div className="share-buttons">
									<button onClick={() => handleShare('twitter')}>Twitter</button>
									<button onClick={() => handleShare('facebook')}>Facebook</button>
									<button onClick={() => handleShare('linkedin')}>LinkedIn</button>
								</div>
								<div className="qr-section">
									<div className="qr-code">
										<QRCodeCanvas value={shortUrl} size={128} level="H" />
									</div>
									<div className="qr-info">
										<h4>QR Code</h4>
										<p>Scan or download the QR code to share your shortened URL easily</p>
										<button
											onClick={() => {
												const canvas = document.querySelector('.qr-code canvas')
												const image = canvas.toDataURL('image/png')
												const link = document.createElement('a')
												link.href = image
												link.download = 'qr-code.png'
												link.click()
											}}
										>
											Download QR Code
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				</main>
				<aside className={`history-list ${shortUrl ? 'visible' : ''}`}>
					<h3>Recent URLs</h3>
					{urlHistory.map((item, index) => (
						<div key={index} className="history-item">
							<div className="history-content">
								<small>{new Date(item.date).toLocaleDateString()}</small>
								<p>{item.long}</p>
								<p>{item.short}</p>
							</div>
							<button onClick={() => navigator.clipboard.writeText(item.short)}>Copy</button>
						</div>
					))}
				</aside>
			</div>
		</>
	)
}

export default App
