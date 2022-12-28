export enum SocketEvents {
	PlayersReceived = 'players',
	CurrentPlayerIndexReceived = 'currentPlayerIndex',
	RefreshPlayers = 'getPlayers',
	PlayerIndexChanged = 'currentPlayerIndexChanged',
	PlayersChanged = 'playersChanged',
	ConfigureServer = 'configureServer',

	SceneChanged = 'sceneChanged',
	SetScene = 'setScene',
	RefreshScene = 'refreshScenes',

	/** Fired when the server updates the time remaining in timer mode. */
	TimerUpdated = 'timerUpdated',
	TimerFinished = 'timerFinished',
	/** Fired when a client updates how much time is remaining in timer mode. */
	AddTime = 'addTime',
	RefreshTime = 'refreshTime',
}

export enum PresentationMode {
	/** Showing the initiative tracker. */
	Initiative = 'Initiative',
	/** Showing a fire scene. */
	FireScene = 'FireScene',
	/** Shows a plain black screen. */
	Offline = 'Offline',
	/** Showing curated, pre-defined RP slides. */
	Slides = 'Slides',
	Timer = 'Timer',
}
