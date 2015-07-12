all:
	rsync -av --exclude=.git . lorner@orner.net:orner.net/portal
