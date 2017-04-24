
Do once:

1) In server/main.go, add JWT key string to second argument of os.Setenv in 'main' function
2) In terminal in kindred/server: `go run *.go`
3) Immediately, remove key you added to main.go and re-comment out that line, so you don't accidentally git-commit the key