# SSH tunnel into your VPS - replace with your own VPS

# Start or stop the SSH tunnel
read -p "Decision: start/stop: " decision
case $decision in
    "start")
        ssh worker@137.184.33.37 -L 6688:localhost:6688 -N -f
        ;;
    
    "stop")
        sudo killall ssh
        ;;
    
    *)
        echo "Unknown command. Valid commands: 'start', 'stop'"
esac