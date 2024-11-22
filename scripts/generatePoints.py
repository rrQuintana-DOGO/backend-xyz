import osmnx as ox
import networkx as nx

def calculate_route():
    start_coords = (17.166239659199654, -96.78676571099837)
    end_coords = (17.123181397233125, -96.76540617506976)

    G = ox.graph_from_point(start_coords, dist=5000, network_type='drive')

    orig_node = ox.distance.nearest_nodes(G, start_coords[1], start_coords[0])
    dest_node = ox.distance.nearest_nodes(G, end_coords[1], end_coords[0])

    route = nx.shortest_path(G, orig_node, dest_node, weight='length')

    route_coords = [{'latitude': G.nodes[node]['y'], 'longitude': G.nodes[node]['x']} for node in route]

    return route_coords

if __name__ == '__main__':
    route_coords = calculate_route()
    print("Coordenadas de la ruta de A a B:")
    print("[")
    for coord in route_coords:
        print(f"  {coord},")
    print("]")