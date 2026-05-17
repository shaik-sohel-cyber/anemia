import json
import os

notebooks = ["anemia.ipynb", "transfer_learning_for_the_anemia.ipynb"]

new_cell = {
    "cell_type": "code",
    "execution_count": None,
    "metadata": {
        "id": "save_weights_backend"
    },
    "outputs": [],
    "source": [
        "# @title Save Weights for Backend\n",
        "# Run this cell after your model has finished training to save the weights.\n",
        "# You can then copy the generated 'geoproteonet.weights.h5' file into the 'backend' folder of your project.\n",
        "model.save_weights(\"geoproteonet.weights.h5\")\n",
        "print(\"Weights successfully saved as 'geoproteonet.weights.h5'!\")\n",
        "print(\"Copy this file into your project's 'backend' folder to use the trained AI.\")\n"
    ]
}

for nb_file in notebooks:
    if os.path.exists(nb_file):
        with open(nb_file, 'r', encoding='utf-8') as f:
            notebook_data = json.load(f)
        
        # Check if we already added it
        already_added = False
        for cell in notebook_data.get("cells", []):
            if cell.get("metadata", {}).get("id") == "save_weights_backend":
                already_added = True
                break
                
        if not already_added:
            # Insert after the training cell or at the end
            notebook_data["cells"].append(new_cell)
            
            with open(nb_file, 'w', encoding='utf-8') as f:
                json.dump(notebook_data, f, indent=2)
            print(f"Added save code to {nb_file}")
        else:
            print(f"Save code already exists in {nb_file}")
