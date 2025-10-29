document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tooltips y popovers si los tuvieras
    // var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    // var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    //   return new bootstrap.Tooltip(tooltipTriggerEl)
    // })

    // Manejo básico de las pestañas (tab-panes)
    // Bootstrap ya maneja esto con data-bs-toggle="pill" pero
    // puedes añadir lógica personalizada aquí si la necesitas.

    // Funcionalidad para Objetivos
    const loadSelections = () => {
        const selectedLevel = localStorage.getItem('selectedLevel');
        const selectedObjective = localStorage.getItem('selectedObjective');
        const selectedSecondaryObjectives = JSON.parse(localStorage.getItem('selectedSecondaryObjectives') || '[]');

        if (selectedLevel) {
            document.querySelectorAll('.level-card').forEach(card => {
                card.classList.remove('selected');
                if (card.dataset.level === selectedLevel) {
                    card.classList.add('selected');
                }
            });
        }

        if (selectedObjective) {
            document.querySelectorAll('.objective-card').forEach(card => {
                card.classList.remove('selected');
                if (card.dataset.objective === selectedObjective) {
                    card.classList.add('selected');
                }
            });
        }

        document.querySelectorAll('.secondary-objective-card').forEach(card => {
            if (selectedSecondaryObjectives.includes(card.dataset.objectiveSecondary)) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    };

    const saveSelection = (type, value) => {
        localStorage.setItem(type, value);
    };

    // Event listeners for level cards
    document.querySelectorAll('.level-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            saveSelection('selectedLevel', this.dataset.level);
        });
    });

    // Event listeners for objective cards
    document.querySelectorAll('.objective-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.objective-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            saveSelection('selectedObjective', this.dataset.objective);
        });
    });

    // Event listeners for secondary objective cards
    document.querySelectorAll('.secondary-objective-card').forEach(card => {
        card.addEventListener('click', function() {
            const objective = this.dataset.objectiveSecondary;
            let selectedSecondaryObjectives = JSON.parse(localStorage.getItem('selectedSecondaryObjectives') || '[]');

            if (selectedSecondaryObjectives.includes(objective)) {
                // Deselect
                selectedSecondaryObjectives = selectedSecondaryObjectives.filter(o => o !== objective);
                this.classList.remove('selected');
            } else {
                // Select (allow multiple)
                selectedSecondaryObjectives.push(objective);
                this.classList.add('selected');
            }

            localStorage.setItem('selectedSecondaryObjectives', JSON.stringify(selectedSecondaryObjectives));
        });
    });

    // New Objective Button
    const newObjectiveBtn = document.getElementById('newObjectiveBtn');
    if (newObjectiveBtn) {
        newObjectiveBtn.addEventListener('click', function() {
            const modal = new bootstrap.Modal(document.getElementById('newObjectiveModal'));
            modal.show();
        });
    }

    // Save Objective Button
    const saveObjectiveBtn = document.getElementById('saveObjectiveBtn');
    if (saveObjectiveBtn) {
        saveObjectiveBtn.addEventListener('click', function() {
            const name = document.getElementById('objectiveName').value;
            const description = document.getElementById('objectiveDescription').value;
            const target = document.getElementById('objectiveTarget').value;
            const deadline = document.getElementById('objectiveDeadline').value;

            if (name) {
                const objectives = JSON.parse(localStorage.getItem('customObjectives') || '[]');
                objectives.push({
                    name,
                    description,
                    target,
                    deadline,
                    createdAt: new Date().toISOString()
                });
                localStorage.setItem('customObjectives', JSON.stringify(objectives));

                // Reset form
                document.getElementById('newObjectiveForm').reset();

                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('newObjectiveModal'));
                modal.hide();

                alert('Objetivo guardado exitosamente!');
            } else {
                alert('Por favor ingresa un nombre para el objetivo.');
            }
        });
    }

    // History Button
    const historyBtn = document.getElementById('historyBtn');
    if (historyBtn) {
        historyBtn.addEventListener('click', function() {
            const objectives = JSON.parse(localStorage.getItem('customObjectives') || '[]');
            const historyContent = document.getElementById('historyContent');

            if (objectives.length > 0) {
                let html = '<ul class="list-group list-group-flush">';
                objectives.forEach(obj => {
                    html += `
                        <li class="list-group-item bg-secondary text-white mb-2 rounded">
                            <h6>${obj.name}</h6>
                            <p>${obj.description || 'Sin descripción'}</p>
                            <small>Objetivo: ${obj.target || 'N/A'} | Fecha límite: ${obj.deadline || 'N/A'}</small>
                        </li>
                    `;
                });
                html += '</ul>';
                historyContent.innerHTML = html;
            } else {
                historyContent.innerHTML = '<p class="text-center text-muted">No hay objetivos personalizados aún.</p>';
            }

            const modal = new bootstrap.Modal(document.getElementById('historyModal'));
            modal.show();
        });
    }

    // Load selections on page load
    loadSelections();

    // Ejemplo de funcionalidad para el panel de prueba en Perfil
    let rachaDays = 17; // Valor inicial de la racha

    const updateRachaDisplay = () => {
        const rachaElement = document.querySelector('#perfil h3.fw-bold');
        if (rachaElement) {
            rachaElement.innerHTML = `${rachaDays} <small class="text-white-50">días seguidos</small>`;
        }
        // Actualizar barra de progreso de racha
        const progressBar = document.querySelector('#perfil .progress-bar');
        const daysToNextReward = 10 - (rachaDays % 10);
        const progressPercentage = (rachaDays % 10) * 10;
        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
            progressBar.setAttribute('aria-valuenow', progressPercentage);
        }
        const nextRewardText = document.querySelector('#perfil .progress + .d-flex small:last-child');
        if (nextRewardText) {
            nextRewardText.textContent = `${daysToNextReward} días`;
        }

        // Actualizar premios obtenidos
        const premiosObtenidos = Math.floor(rachaDays / 10);
        const diasGanados = premiosObtenidos * 3;
        const premiosObtenidosElement = document.querySelector('.card.bg-secondary:nth-of-type(3) .row.g-2 .col-6:first-child .fw-bold');
        const diasGanadosElement = document.querySelector('.card.bg-secondary:nth-of-type(3) .row.g-2 .col-6:last-child .fw-bold');
        if (premiosObtenidosElement) premiosObtenidosElement.textContent = premiosObtenidos;
        if (diasGanadosElement) diasGanadosElement.textContent = diasGanados;
    };

    const addRachaBtn = document.getElementById('addRachaBtn');
    if (addRachaBtn) {
        addRachaBtn.addEventListener('click', function() {
            rachaDays++;
            updateRachaDisplay();
        });
    }

    const resetRachaBtn = document.getElementById('resetRachaBtn');
    if (resetRachaBtn) {
        resetRachaBtn.addEventListener('click', function() {
            rachaDays = 0;
            updateRachaDisplay();
        });
    }

    const simulatePremiumBtn = document.getElementById('simulatePremiumBtn');
    if (simulatePremiumBtn) {
        simulatePremiumBtn.addEventListener('click', function() {
            // Simular activación de Premium
            const premiumCardInactivo = document.querySelector('.card.bg-secondary:first-of-type'); // La primera card premium
            const premiumCardActivo = document.getElementById('rendixPremiumActivo');

            if (premiumCardInactivo && premiumCardActivo) {
                premiumCardInactivo.classList.add('d-none');
                premiumCardActivo.classList.remove('d-none');
                alert('¡Premium activado por 10 días simulados!');
            }
        });
    }


    // Funcionalidad para Deportes
    const sportData = {
        calistenia: {
            title: 'Calistenia',
            description: 'Ejercicios con peso corporal para desarrollar fuerza y flexibilidad.',
            exercises: [
                'Flexiones de brazos',
                'Dominadas',
                'Sentadillas',
                'Planchas',
                'Fondos de tríceps'
            ]
        },
        cardio: {
            title: 'Cardio',
            description: 'Ejercicios cardiovasculares para mejorar la resistencia y quemar calorías.',
            exercises: [
                'Correr',
                'Saltar la cuerda',
                'Ciclismo',
                'Natación',
                'Baile'
            ]
        },
        fuerza: {
            title: 'Entrenamiento de Fuerza',
            description: 'Ejercicios con pesas y resistencia para ganar masa muscular.',
            exercises: [
                'Press de banca',
                'Sentadillas con barra',
                'Peso muerto',
                'Curl de bíceps',
                'Extensiones de tríceps'
            ]
        }
    };

    const loadSportsSelections = () => {
        const selectedSports = JSON.parse(localStorage.getItem('selectedSports') || '[]');
        document.querySelectorAll('.sport-card').forEach(card => {
            if (selectedSports.includes(card.dataset.sport)) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
        updateRecommendations();
    };

    const updateRecommendations = () => {
        const selectedLevel = localStorage.getItem('selectedLevel');
        const selectedObjective = localStorage.getItem('selectedObjective');
        const selectedSports = JSON.parse(localStorage.getItem('selectedSports') || '[]');

        const recommendationsDiv = document.querySelector('.card.bg-secondary.mb-4.p-3 h6').parentElement.querySelector('ul');
        let recommendations = [];

        if (selectedLevel === 'principiante') {
            recommendations.push({
                sport: 'Calistenia',
                level: 'Altamente recomendado',
                desc: 'Perfecto para principiantes que buscan tonificar'
            });
            if (selectedObjective === 'mejorar-resistencia') {
                recommendations.push({
                    sport: 'Cardio',
                    level: 'Buena opción',
                    desc: 'Ideal para mejorar resistencia cardiovascular'
                });
            }
        } else if (selectedLevel === 'intermedio') {
            recommendations.push({
                sport: 'Cardio',
                level: 'Recomendado',
                desc: 'Excelente para mantener la resistencia'
            });
            recommendations.push({
                sport: 'Entrenamiento de Fuerza',
                level: 'Buena opción',
                desc: 'Para ganar fuerza y masa muscular'
            });
        } else if (selectedLevel === 'avanzado') {
            recommendations.push({
                sport: 'Entrenamiento de Fuerza',
                level: 'Altamente recomendado',
                desc: 'Para atletas avanzados'
            });
            recommendations.push({
                sport: 'Calistenia',
                level: 'Recomendado',
                desc: 'Para mantener la forma física'
            });
        }

        // If no level selected, default recommendations
        if (!selectedLevel) {
            recommendations = [
                {
                    sport: 'Calistenia',
                    level: 'Altamente recomendado',
                    desc: 'Perfecto para principiantes que buscan tonificar'
                },
                {
                    sport: 'Cardio',
                    level: 'Buena opción',
                    desc: 'Ideal para mejorar resistencia cardiovascular'
                }
            ];
        }

        let html = '';
        recommendations.forEach(rec => {
            html += `
                <li class="mb-2">
                    <i class="fas fa-circle text-primary me-2 icon-sm"></i>
                    <span class="fw-bold">${rec.sport} - ${rec.level}</span>
                    <p class="text-white small mb-0 ms-4">${rec.desc}</p>
                </li>
            `;
        });
        recommendationsDiv.innerHTML = html;
    };

    // Event listeners for sport cards
    document.querySelectorAll('.sport-card').forEach(card => {
        card.addEventListener('click', function() {
            const sport = this.dataset.sport;
            let selectedSports = JSON.parse(localStorage.getItem('selectedSports') || '[]');

            if (selectedSports.includes(sport)) {
                // Deselect
                selectedSports = selectedSports.filter(s => s !== sport);
                this.classList.remove('selected');
            } else {
                // Select (allow multiple)
                selectedSports.push(sport);
                this.classList.add('selected');
            }

            localStorage.setItem('selectedSports', JSON.stringify(selectedSports));

            // Show modal with details
            const data = sportData[sport];
            const modalBody = document.getElementById('sportModalBody');
            modalBody.innerHTML = `
                <h5>${data.title}</h5>
                <p>${data.description}</p>
                <h6>Ejercicios Principales:</h6>
                <ul>
                    ${data.exercises.map(ex => `<li>${ex}</li>`).join('')}
                </ul>
            `;
            const modal = new bootstrap.Modal(document.getElementById('sportModal'));
            modal.show();

            updateRecommendations();
        });
    });

    // Load sports selections on page load
    loadSportsSelections();

    updateRachaDisplay(); // Llamar al inicio para establecer el estado inicial
});
