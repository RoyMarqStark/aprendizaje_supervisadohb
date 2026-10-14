# 🚢 Titanic - Supervised Learning & Predictive Dashboard

Este repositorio contiene un proyecto completo de **Aprendizaje Supervisado** aplicado al dataset de Titanic, abarcando desde el análisis exploratorio de datos (EDA), limpieza y preprocesamiento, hasta el entrenamiento de modelos de Machine Learning (Random Forest y Regresión Logística) y un dashboard interactivo.

---

## 📁 Estructura del Proyecto

```text
├── dashboard/                 # Interfaz web y dashboard interactivo
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── data/                      # Datasets del proyecto
│   ├── titanic.csv            # Dataset original
│   ├── titanic_clean.csv      # Dataset limpio
│   └── titanic_feature.csv    # Dataset con ingeniería de características
├── EDA.ipynb                  # Análisis Exploratorio de Datos
├── clean.ipynb                # Pipeline de limpieza y manejo de nulos
├── feature_engineering.ipynb  # Creación y selección de variables
├── train.ipynb                # Entrenamiento experimental y métricas
├── train.py                   # Script de entrenamiento modular
├── model_lr.joblib            # Modelo serializado: Regresión Logística
├── model_rf.joblib            # Modelo serializado: Random Forest
├── requirements.txt           # Dependencias del proyecto
└── README.md                  # Documentación del proyecto
```

---

## 🛠️ Tecnologías y Librerías

- **Lenguaje:** Python 3.10+
- **Machine Learning & Preprocesamiento:** `scikit-learn`, `joblib`
- **Manipulación de Datos:** `pandas`, `numpy`
- **Visualización:** `matplotlib`, `seaborn`
- **Entorno Interactivo:** `Jupyter Notebook` / `IPython`
- **Dashboard:** HTML5, CSS3, JavaScript

---

## 🚀 Instalación y Uso

### 1. Clonar el repositorio
```bash
git clone https://github.com/RoyMarqStark/aprendizaje_supervisadohb.git
cd aprendizaje_supervisadohb
```

### 2. Crear y activar un entorno virtual
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 4. Entrenar los modelos
Para ejecutar el script de entrenamiento de Machine Learning:
```bash
python train.py
```

---

## 📊 Modelos Evaluados

1. **Random Forest Classifier**: Modelo de ensamble basado en árboles de decisión optimizado para prevenir sobreajuste.
2. **Logistic Regression**: Modelo lineal base con escalamiento de características y codificación One-Hot.

---

## 👤 Autor

- **RoyMarqStark**
