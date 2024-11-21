from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import threading
import time
import osmnx as ox
import networkx as nx

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")

route_coords = []

@app.route('/')
def index():
    return "Socket.IO server is running."

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

def emit_location():
    while True:
        for location_data in route_coords:
            socketio.emit('location', {'latitude': location_data[0], 'longitude': location_data[1]})
            time.sleep(5)  

def calculate_route():
    global route_coords
    start_coords = (17.166239659199654, -96.78676571099837)
    end_coords = (17.123181397233125, -96.76540617506976)

    G = ox.graph_from_point(start_coords, dist=5000, network_type='drive')

    orig_node = ox.distance.nearest_nodes(G, start_coords[1], start_coords[0])
    dest_node = ox.distance.nearest_nodes(G, end_coords[1], end_coords[0])

    route = nx.shortest_path(G, orig_node, dest_node, weight='length')

    route_coords = [(G.nodes[node]['y'], G.nodes[node]['x']) for node in route]

    print("Coordenadas de la ruta de A a B:")
    for coord in route_coords:
        print(coord)

if __name__ == '__main__':
    calculate_route()
    thread = threading.Thread(target=emit_location)
    thread.daemon = True
    thread.start()
    socketio.run(app, host='0.0.0.0', port=5020)