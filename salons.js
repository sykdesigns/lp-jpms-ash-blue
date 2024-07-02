document.addEventListener('DOMContentLoaded', function() {
    const stateSelect = document.getElementById('stateSelect');
    const salonList = document.getElementById('salonList');
    const salonModal = document.getElementById('salonModal');

    // Fetch the JSON data
    fetch('salon_data.json')
        .then(response => response.json())
        .then(salons => {
            populateStateSelect(salons);
            stateSelect.addEventListener('change', function() {
                const selectedState = stateSelect.value;
                displaySalons(salons, selectedState);
                openModal();
            });
        });

    function populateStateSelect(salons) {
        const states = [...new Set(salons.map(salon => salon.State))].sort();
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
        });
    }

    function displaySalons(salons, state) {
        salonList.innerHTML = '';
        const filteredSalons = salons.filter(salon => salon.State === state);

        if (filteredSalons.length === 0) {
            salonList.innerHTML = '<p>No salons found in this state.</p>';
        } else {
            filteredSalons.forEach(salon => {
                const salonDiv = document.createElement('div');
                salonDiv.classList.add('salon');

                salonDiv.innerHTML = `
                    <h3>${salon.Salon}</h3>
                    <p>${salon['Address 1']} ${salon['Address 2'] || ''}</p>
                    <p>${salon.City}, ${salon.State}</p>
                    <p>${salon.Phone}</p>
                `;

                const mapsButton = document.createElement('button');
                mapsButton.textContent = 'Open in Google Maps';
                mapsButton.style.padding = '8px 16px';
                mapsButton.style.fontSize = '14px';
                mapsButton.style.color = 'white';
                mapsButton.style.backgroundColor = 'black'; //color for Google Maps button
                mapsButton.style.border = 'none';
                mapsButton.style.borderRadius = '25px';
                mapsButton.style.cursor = 'pointer';
                mapsButton.style.marginTop = '12px';
                mapsButton.style.marginBottom = '12px';
                mapsButton.onclick = function() {
                    openInMaps(encodeURIComponent(salon['Address 1'] + ' ' + (salon['Address 2'] || '') + ' ' + salon.City + ' ' + salon.State + ' ' + salon['Zip Code']));
                };

                salonDiv.appendChild(mapsButton);
                salonList.appendChild(salonDiv);
            });

            if (window.innerWidth < 620) {
                initializeCarousel(); // Initialize the carousel for mobile
            }
        }
    }

    function openModal() {
        salonModal.classList.add('open');
    }

    window.closeModal = function() {
        salonModal.classList.remove('open');
    }

    function openInMaps(address) {
        const mapsUrl = `https://www.google.com/maps?q=${address}`;
        window.open(mapsUrl, '_blank');
    }

    function initializeCarousel() {
        let startX;
        let scrollLeft;

        salonList.addEventListener('mousedown', (e) => {
            startX = e.pageX - salonList.offsetLeft;
            scrollLeft = salonList.scrollLeft;
            salonList.classList.add('active');
        });

        salonList.addEventListener('mouseleave', () => {
            salonList.classList.remove('active');
        });

        salonList.addEventListener('mouseup', () => {
            salonList.classList.remove('active');
        });

        salonList.addEventListener('mousemove', (e) => {
            if (!salonList.classList.contains('active')) return;
            e.preventDefault();
            const x = e.pageX - salonList.offsetLeft;
            const walk = (x - startX) * 3; //scroll-fast
            salonList.scrollLeft = scrollLeft - walk;
        });

        salonList.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - salonList.offsetLeft;
            scrollLeft = salonList.scrollLeft;
            salonList.classList.add('active');
        });

        salonList.addEventListener('touchend', () => {
            salonList.classList.remove('active');
        });

        salonList.addEventListener('touchmove', (e) => {
            if (!salonList.classList.contains('active')) return;
            const x = e.touches[0].pageX - salonList.offsetLeft;
            const walk = (x - startX) * 3; //scroll-fast
            salonList.scrollLeft = scrollLeft - walk;
        });
    }
});
