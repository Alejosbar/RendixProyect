document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const restartButton = document.getElementById('restartButton');
    const currentStepSpan = document.getElementById('currentStep');
    const totalStepsSpan = document.getElementById('totalSteps');
    const progressIndicatorsContainer = document.getElementById('progress-indicators');

    const canvasSteps = Array.from(document.querySelectorAll('.canvas-step'));
    let currentStepIndex = 0; // 0 para la introducción, 1-9 para el Canvas, 10 para el final
    const totalContentSteps = canvasSteps.length -1; // Excluye la intro

    totalStepsSpan.textContent = totalContentSteps;

    // Función para mostrar un paso específico
    const showStep = (index) => {
        canvasSteps.forEach((step, i) => {
            step.classList.remove('active');
            step.style.display = 'none'; // Oculta físicamente el elemento
        });

        if (canvasSteps[index]) {
            canvasSteps[index].style.display = 'block'; // Muestra físicamente el elemento antes de activar la clase
            setTimeout(() => {
                canvasSteps[index].classList.add('active');
            }, 10); // Pequeño delay para que la transición CSS funcione
        }

        updateNavigationButtons();
        updateProgressIndicators();
        updateStepCounter();
    };

    // Actualiza los botones de navegación (Next, Prev, Restart)
    const updateNavigationButtons = () => {
        // Oculta todos los botones de navegación por defecto
        prevButton.style.display = 'none';
        nextButton.style.display = 'none';
        restartButton.style.display = 'none';
        startButton.style.display = 'none'; // Ocultar el botón de inicio una vez que se ha iniciado

        if (currentStepIndex === 0) {
            startButton.style.display = 'block'; // Solo muestra el botón de inicio
        } else if (currentStepIndex > 0 && currentStepIndex < canvasSteps.length -1) {
            prevButton.style.display = 'inline-flex';
            nextButton.style.display = 'inline-flex';
            restartButton.style.display = 'inline-flex';
        } else if (currentStepIndex === canvasSteps.length -1) { // Último paso (Contacto)
            prevButton.style.display = 'inline-flex';
            nextButton.style.display = 'none'; // No hay más pasos
            restartButton.style.display = 'inline-flex';
        }
    };

    // Actualiza el contador de pasos (1/9)
    const updateStepCounter = () => {
        if (currentStepIndex > 0 && currentStepIndex <= totalContentSteps) {
            currentStepSpan.textContent = currentStepIndex;
        } else if (currentStepIndex === totalContentSteps + 1) { // Si estamos en la sección final
            currentStepSpan.textContent = totalContentSteps; // Mostrar el último número de paso
        } else {
            currentStepSpan.textContent = 0; // Para la intro, o si no hay pasos de contenido
        }
    };

    // Genera y actualiza los indicadores de progreso (puntos)
    const updateProgressIndicators = () => {
        progressIndicatorsContainer.innerHTML = ''; // Limpiar los puntos existentes
        // Generar puntos solo para los pasos de contenido
        for (let i = 1; i <= totalContentSteps; i++) {
            const dot = document.createElement('div');
            dot.classList.add('progress-dot');
            if (i === currentStepIndex) {
                dot.classList.add('active');
            }
            // Añadir funcionalidad para saltar a un paso al hacer clic en el punto
            dot.addEventListener('click', () => {
                currentStepIndex = i;
                showStep(currentStepIndex);
            });
            progressIndicatorsContainer.appendChild(dot);
        }
    };

    // Event Listeners
    startButton.addEventListener('click', () => {
        currentStepIndex = 1; // Ir al primer paso del Canvas
        showStep(currentStepIndex);
    });

    nextButton.addEventListener('click', () => {
        if (currentStepIndex < canvasSteps.length -1) {
            currentStepIndex++;
            showStep(currentStepIndex);
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentStepIndex > 1) { // No permitir retroceder de la primera sección a la intro con el botón 'Prev'
            currentStepIndex--;
            showStep(currentStepIndex);
        } else if (currentStepIndex === 1) { // Si estamos en el paso 1, volvemos a la intro
             currentStepIndex = 0;
             showStep(currentStepIndex);
        }
    });

    restartButton.addEventListener('click', () => {
        currentStepIndex = 0; // Volver a la sección de introducción
        showStep(currentStepIndex);
    });

    // Inicializar la presentación en la primera sección (intro)
    showStep(currentStepIndex);
});