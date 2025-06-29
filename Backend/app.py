import pandas as pd
import numpy as np
import agentpy as ap
from itertools import islice
import networkx as nx
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

DATASET_PATH = "first_ds.csv"

graph_data = {}
active_simulations = {}  # Dictionary to store active simulation instances
G = None
centrality_sorted_items=None
eigenvector_centrality_sorted=None
closeness_centrality_sorted=None
betweenness_centrality_sorted=None
harmonic_centrality_sorted=None
percolation_centrality_sorted=None
load_centrality_sorted=None

#Create Adjacency Matrix from given data
def process_csv(file_path):
    df = pd.read_csv(file_path)
    nodes = sorted(set(df['SRC']).union(set(df['DEST'])))
    node_index = {node: idx for idx, node in enumerate(nodes)}
    size = len(nodes)
    adj_matrix = np.zeros((size, size))
    for _, row in df.iterrows():
        src_idx = node_index[row['SRC']]
        dest_idx = node_index[row['DEST']]
        adj_matrix[src_idx][dest_idx] = row['NormFreq']
    return adj_matrix, nodes

#Initialize Graph data in JSON format for ReactForce Processing
def create_graph_data(matrix, nodes):
    global graph_data
    num_nodes = len(matrix)
    node_data = [
        {"id": str(i), "name": nodes[i], "color": "blue"} 
        for i in range(num_nodes)
    ]
    links = [
        {"source": str(i), "target": str(j)}
        for i in range(num_nodes)
        for j in range(num_nodes)
        if matrix[i][j] != 0
    ]
    graph_data = {
        "nodes": node_data,
        "links": links
    }
    return graph_data



################################################################
#Our Simulation Model
################################################################

#Define Single agent
class Person:
    def __init__(self, id):
        self.id = id
        self.condition = 0  # 0--> Uninformed && 1 --> Informed
        self.color = "blue"

#Simulation 
class InfoDiffusion:
    def __init__(self, params):
        self.steps = 0
        self.G = params['G']
        self.population = params['population']
        self.initial_spread = params['initial_information_spread_share']
        self.simulation_states = []
        
        # Initialize agents
        self.agents = {}
        for i in range(self.population):
            self.agents[i] = Person(str(i))
            self.agents[i].color = "blue"
        
        # Set initial informed agents
        initial_informed = int(self.initial_spread * self.population)
        informed_indices = np.random.choice(self.population, initial_informed, replace=False)
        for idx in informed_indices:
            self.agents[idx].condition = 1
            self.agents[idx].color = "red"
        
        self.simulation_states.append(self.get_current_state())
        
        self.attempts_without_update = 0 
        self.max_attempts_without_update = 100


    # Returns the current state of all nodes in the simulation.
    def get_current_state(self):
        return {
            "step": self.steps,
            "nodes": [
                {
                    "id": str(i),
                    "color": agent.color,
                    "condition": agent.condition
                }
                for i, agent in self.agents.items()
            ]
        }

    def step(self):
        updated = False ###########not needed
        
        # Get all informed nodes and uninformed nodes
        informed_nodes = [i for i, agent in self.agents.items() if agent.condition == 1]
        uninformed_nodes = [i for i, agent in self.agents.items() if agent.condition == 0]
        
        # If no uninformed nodes left, stop simulation
        if not uninformed_nodes:
            return True
            
        if informed_nodes:  # Only continue if we have informed nodes
            selected_informer = np.random.choice(informed_nodes)
            
            # Get uninformed neighbors of the selected node
            uninformed_neighbors = [n for n in self.G.neighbors(selected_informer) 
                                 if self.agents[n].condition == 0]
            
            if uninformed_neighbors:
                # Update one random neighbor
                target_node = np.random.choice(uninformed_neighbors)
                self.agents[target_node].condition = 1
                self.agents[target_node].color = "red"
                socketio.emit('update_node', {
                    'id': str(target_node),
                    'color': 'red'
                })
                updated = True 
                self.attempts_without_update = 0
            else:
                self.attempts_without_update += 1
        
        self.simulation_states.append(self.get_current_state())
        self.steps += 1
        
        # Only stop if all nodes are informed or we're completely stuck
        stuck = self.attempts_without_update >= self.max_attempts_without_update ######### All node condition not written, hence at end it will stuck either way
        return stuck

    def run(self):
        while True:
            should_stop = self.step() #######here agent py library autiomatically increments this.. hence we havent utilized it properly here
            if should_stop:
                break
        return self.simulation_states

################################################################
################################################################


#utility function
def get_dataset_path(datasetId):
    dataset_mapping = {
        1: "first_ds.csv",
        2: "second_ds.csv",
        3: "third_ds.csv"
    }
    datasetId= int(datasetId)
    return dataset_mapping.get(datasetId)

@app.route('/get_dataset/<datasetId>', methods=["GET"])
def get_dataset(datasetId):
    try:
        DATASET_PATH=get_dataset_path(datasetId)
        adj_matrix, nodes = process_csv(DATASET_PATH)
        create_graph_data(adj_matrix, nodes)
        return jsonify(graph_data)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/<datasetId>", methods=["POST"])
def start_simulation(datasetId):
    """
    1) Parse params from JSON.
    2) Rebuild adjacency from CSV.
    3) Create the InfoDiffusion model, but run it in a background thread/task.
    4) Immediately return so the front end doesn't block.
    """
    global centrality_sorted_items, G, eigenvector_centrality_sorted,closeness_centrality_sorted,betweenness_centrality_sorted,harmonic_centrality_sorted,percolation_centrality_sorted, load_centrality_sorted
    try:
        DATASET_PATH=get_dataset_path(datasetId)
        parameters = request.get_json()
        adj_matrix, nodes = process_csv(DATASET_PATH)
        G = nx.from_numpy_array(adj_matrix, create_using=nx.DiGraph())
        
        centrality=nx.degree_centrality(G)
        centrality_sorted_items = sorted(centrality.items(), key=lambda kv: (kv[1], kv[0]), reverse=True)
        
        eigenvector_centrality=nx.eigenvector_centrality_numpy(G)
        eigenvector_centrality_sorted = sorted(eigenvector_centrality.items(), key=lambda kv: (kv[1], kv[0]), reverse=True)

        closeness_centrality=nx.closeness_centrality(G)
        closeness_centrality_sorted = sorted(closeness_centrality.items(), key=lambda kv: (kv[1], kv[0]), reverse=True)
        
        betweenness_centrality=nx.betweenness_centrality(G)
        betweenness_centrality_sorted = sorted(betweenness_centrality.items(), key=lambda kv: (kv[1], kv[0]), reverse=True)

        harmonic_centrality=nx.harmonic_centrality(G)
        harmonic_centrality_sorted = sorted(harmonic_centrality.items(), key=lambda kv: (kv[1], kv[0]), reverse=True)

        percolation_centrality=nx.percolation_centrality(G)
        percolation_centrality_sorted = sorted(percolation_centrality.items(), key=lambda kv: (kv[1], kv[0]), reverse=True)

        load_centrality=nx.load_centrality(G)
        load_centrality_sorted = sorted(load_centrality.items(), key=lambda kv: (kv[1], kv[0]), reverse=True)


        model_params = {
            "G": G,
            "population": len(nodes),
            "initial_information_spread_share": parameters.get("initial_information_spread_share", 0.1)
        }

        # Create and run model
        model = InfoDiffusion(model_params)
        simulation_states = model.run()
        
        simulation_id = str(id(model))
        active_simulations[simulation_id] = {
            "model": model,
            "states": simulation_states
        }

        return jsonify({
            "status": "completed",
            "initial_graph": graph_data,
            "total_steps": len(simulation_states),
            "simulation_id": simulation_id
        }), 200

    except Exception as e:
        print(f"Error in start_simulation: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# New route to get simulation state at specific step
@app.route("/simulation/<simulation_id>/step/<int:step>", methods=["GET"])
def get_simulation_step(simulation_id, step):
    try:
        simulation = active_simulations.get(simulation_id)
        if not simulation or step >= len(simulation["states"]):
            return jsonify({"error": "Invalid simulation or step"}), 404

        return jsonify(simulation["states"][step])
    except Exception as e:
        print(f"Error in get_simulation_step: {str(e)}")  # Debug logging
        return jsonify({"error": str(e)}), 500

# Add cleanup route (optional but recommended)
@app.route("/simulation/<simulation_id>", methods=["DELETE"])
def cleanup_simulation(simulation_id):
    try:
        if simulation_id in active_simulations:
            del active_simulations[simulation_id]
        return jsonify({"status": "success"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def run_model_task(parameters):
    """Actual simulation logic in a background thread."""
    model = InfoDiffusion(parameters)
    model.run()
    # The model will emit real-time updates as it steps.

@socketio.on("connect")
def handle_socket_connect():
    print("Socket connected")


################################################################
#Centrality Functions
################################################################

#New route to get the most influential node
@app.route("/degree_centrality", methods=["GET"])
def get_degree_centrality():
    global centrality_sorted_items
    if(centrality_sorted_items==None):
        return jsonify({"msg":"No data found"})
    json_data = [{"node_id": t[0], "centrality_value": t[1]} for t in centrality_sorted_items]
    return jsonify(json_data)

@app.route("/eigenvector_centrality", methods=["GET"])
def get_eigenvector_centrality():
    global eigenvector_centrality_sorted
    if(eigenvector_centrality_sorted==None):
        return jsonify({"msg":"No data found"})
    result = [{"node_id": int(t[0]), "centrality_value": float(t[1])} for t in eigenvector_centrality_sorted]
    return jsonify(result)

@app.route("/closeness_centrality",methods=["GET"])
def get_closeness_centrality():
    global closeness_centrality_sorted
    if(closeness_centrality_sorted==None):
        return jsonify({"msg":"No data found"})
    result = [{"node_id": int(t[0]), "centrality_value": float(t[1])} for t in closeness_centrality_sorted]
    return jsonify(result)

@app.route("/betweenness_centrality",methods=["GET"])
def get_betweenness_centrality():
    global betweenness_centrality_sorted
    if(betweenness_centrality_sorted==None):
        return jsonify({"msg":"No data found"})
    result = [{"node_id": int(t[0]), "centrality_value": float(t[1])} for t in betweenness_centrality_sorted]
    return jsonify(result)

@app.route("/harmonic_centrality",methods=["GET"])
def get_harmonic_centrality():
    global harmonic_centrality_sorted
    if(harmonic_centrality_sorted==None):
        return jsonify({"msg":"No data found"})
    result = [{"node_id": int(t[0]), "centrality_value": float(t[1])} for t in harmonic_centrality_sorted]
    return jsonify(result)

@app.route("/percolation_centrality",methods=["GET"])
def get_percolation_centrality():
    global percolation_centrality_sorted
    if(percolation_centrality_sorted==None):
        return jsonify({"msg":"No data found"})
    result = [{"node_id": int(t[0]), "centrality_value": float(t[1])} for t in percolation_centrality_sorted]
    
    for i in range(25):
        for j in range(len(graph_data["nodes"])):
            if result[i]["node_id"] == int(graph_data["nodes"][j]["id"]):
                graph_data["nodes"][j]["color"]="green"
                print(graph_data["nodes"][j])

    return jsonify(result)

@app.route("/load_centrality",methods=["GET"])
def get_load_centrality():
    global load_centrality_sorted
    if(load_centrality_sorted==None):
        return jsonify({"msg":"No data found"})
    result = [{"node_id": int(t[0]), "centrality_value": float(t[1])} for t in load_centrality_sorted]
    return jsonify(result)


################################################################
################################################################

if __name__ == "__main__":
    socketio.run(app, debug=True, host="127.0.0.1", port=5000)
