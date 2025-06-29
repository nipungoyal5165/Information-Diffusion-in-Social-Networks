# Information-Diffusion-in-Social-Networks

This project is a full-stack web application that simulates how messages and ideas spread across social contact networks. Using Agent-Based Modeling (ABM) and graph analysis tools like Neo4j and NetworkX, the simulation illustrates how information diffuses through various network topologies. The project leverages Python for backend simulations and React.js for an interactive frontend.

---

## Features

1. **Real-Time Simulation**: Visualize how messages diffuse over social networks using ABM logic.
2. **Graph Analytics**: View key centrality metrics, such as node influence and cluster behavior.
3. **Dataset Integration**: Analyze diffusion across real-world datasets (VS13, VS15, LyonSchool).
4. **Interactive UI**: Control simulation speed, steps, and see real-time state transitions.

---

## Demo Video

A presentation demo is available on Google Drive accessible through https://drive.google.com/file/d/157biwblCbeccgh32D812i0iQPZG1u23o/view?usp=sharing

---

## Presentation 

A presentation file of the R&D Report is available on Google Drive accessible through https://docs.google.com/presentation/d/1rDQm-mNyaH6ntyVr-kmOXfzOaGOzFpCO/edit?usp=sharing&ouid=118211644123601402436&rtpof=true&sd=true

---

## Setup and Installation

### Prerequisites

Ensure the following are installed before proceeding:

* **Python 3.8+**: [https://www.python.org/downloads/](https://www.python.org/downloads/)
* **Node.js + npm**: [https://nodejs.org/](https://nodejs.org/)
* **Git** (optional but recommended)

---

## Backend Setup (Flask)

1. Open terminal and navigate to the project folder:

```bash
cd ~/Desktop/capstone/backend
```

2. Create a virtual environment:

```bash
python3 -m venv venv
```

3. Activate the virtual environment:

```bash
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

5. Set the Flask application:

```bash
export FLASK_APP=app.py  # On Windows: set FLASK_APP=app.py
```

6. Run the backend server:

```bash
flask run
```

> The backend will start on: [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## Frontend Setup (React)

1. Navigate to the frontend directory:

```bash
cd ~/Desktop/capstone/frontend
```

2. Install Node.js dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev  # Use sudo if permission is denied
```

4. Open the frontend in your browser:

```
http://localhost:5173
```

---

## File Structure

```
capstone/
├── backend/
│   ├── app.py                # Flask backend server
│   ├── first_ds.csv          # VS13 Dataset csv
│   ├── second_ds.csv         # VS15 Dataset csv
│   ├── third_ds.csv          # LyonSchool Dataset csv
│   ├── simulation/           # Agent-based simulation logic (AgentPy)
│   ├── static/               # Static files if needed by Flask
│   ├── requirements.txt      # Backend dependencies
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/       # React components (Navbar, Controls, etc.)
│   │   ├── pages/            # Graph and Home pages
│   │   └── App.jsx           # Main React file
│   ├── public/
│   ├── package.json          # Frontend dependencies
│   └── ...
└── README.md
```

---

## Usage Instructions

1. **Start both frontend and backend** as described above.
2. Select a dataset from the UI.
3. Start, pause, or reset the simulation.
4. Observe real-time network diffusion and centrality metrics.
5. Switch datasets to compare diffusion patterns.

---

## Sample Datasets

* **VS13**: Workplace interactions (2013)
* **VS15**: Workplace interactions (2015)
* **LyonSchool**: School-based contact network

All datasets are graph-formatted with nodes as individuals and weighted edges representing interactions.

---

## Troubleshooting

* **CORS Errors**: Ensure Flask-CORS is enabled in backend (`flask_cors` installed).
* **Port Conflicts**: Make sure ports 5000 (Flask) and 5173 (Vite/React) are free.
* **Python/Node Not Found**: Check installation and PATH variables.
* **npm ERR!**: Delete `node_modules/` and try `npm install` again.

---

## Future Enhancements

* Incorporate real-time data from APIs (e.g., Twitter, Reddit).
* Introduce additional models like SIR, IC, LT for comparison.
* Improve UI with visual filters and storytelling features.
* Enable export of simulation results as CSV or PNG.

---

## GitHub Repository

> The full source code and documentation are available here:
> **[https://github.com/your-username/Information-Diffusion-in-Social-Networks](https://github.com/your-username/Information-Diffusion-in-Social-Networks)**

---

## License

This project is open-source and distributed under the MIT License.

---

> \[!TIP]
> Feel free to contribute to this project by forking the repository and submitting pull requests!
