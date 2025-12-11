document.addEventListener('DOMContentLoaded', () => {
    const steps = ['step-1', 'step-2', 'step-3', 'step-4'];
    let currentStep = 0;
    let formData = {
        type: '',
        model: '',
        condition: ''
    };

    // Mock Data
    const models = {
        smartphone: ['iPhone 13', 'iPhone 14', 'Samsung Galaxy S22', 'Google Pixel 7'],
        laptop: ['MacBook Pro M1', 'Dell XPS 13', 'Lenovo ThinkPad'],
        tablet: ['iPad Pro', 'Samsung Galaxy Tab'],
        smartwatch: ['Apple Watch Series 8', 'Galaxy Watch 5']
    };

    const basePrices = {
        'iPhone 13': 400, 'iPhone 14': 500, 'Samsung Galaxy S22': 350, 'Google Pixel 7': 300,
        'MacBook Pro M1': 800, 'Dell XPS 13': 600, 'Lenovo ThinkPad': 500,
        'iPad Pro': 400, 'Samsung Galaxy Tab': 250,
        'Apple Watch Series 8': 200, 'Galaxy Watch 5': 150
    };

    // Navigation Functions
    function showStep(stepId) {
        document.querySelectorAll('.wizard-step').forEach(el => el.style.display = 'none');
        document.getElementById(stepId).style.display = 'block';
    }

    // Step 1: Device Type Selection
    document.querySelectorAll('.device-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            formData.type = btn.dataset.type;
            populateModels(formData.type);
            showStep('step-2');
        });
    });

    function populateModels(type) {
        const select = document.getElementById('model-select');
        select.innerHTML = '<option value="">Select a model...</option>';
        models[type].forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            select.appendChild(option);
        });
    }

    // Step 2: Model Selection
    const modelSelect = document.getElementById('model-select');
    modelSelect.addEventListener('change', (e) => {
        formData.model = e.target.value;
        document.getElementById('step-2-next').disabled = !formData.model;
    });

    // Step 3: Condition Selection
    document.querySelectorAll('input[name="condition"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            formData.condition = e.target.value;
            document.getElementById('step-3-next').disabled = false;
        });
    });

    // Back Buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            showStep(target);
        });
    });

    // Next Buttons
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            if (target === 'step-4') {
                calculateQuote();
            }
            showStep(target);
        });
    });

    function calculateQuote() {
        let price = basePrices[formData.model] || 0;

        // Condition Multipliers
        if (formData.condition === 'good') price *= 0.8;
        if (formData.condition === 'broken') price *= 0.3;

        const ecoPoints = Math.floor(price * 10); // 10 points per dollar

        document.getElementById('quote-value').textContent = `$${price.toFixed(2)}`;
        document.getElementById('eco-points').textContent = ecoPoints;
    }
    // Accept Quote Button
    document.getElementById('accept-quote-btn').addEventListener('click', () => {
        const price = parseFloat(document.getElementById('quote-value').textContent.replace('$', ''));
        const ecoPoints = parseInt(document.getElementById('eco-points').textContent);

        const newOrder = {
            id: '#' + Math.floor(Math.random() * 9000 + 1000),
            user: 'User', // Mock user
            device: `${formData.model} (${formData.condition})`,
            status: 'Processing',
            amount: price,
            points: ecoPoints,
            date: new Date().toISOString()
        };

        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.unshift(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Update total earnings and CO2 (mock logic)
        let earnings = parseFloat(localStorage.getItem('totalEarnings') || '0');
        earnings += price;
        localStorage.setItem('totalEarnings', earnings.toFixed(2));

        let co2 = parseFloat(localStorage.getItem('totalCO2') || '0');
        co2 += (price * 0.05); // Mock CO2 calculation
        localStorage.setItem('totalCO2', co2.toFixed(1));

        alert('Quote accepted! Order placed.');
        window.location.href = 'dashboard.html';
    });
});
