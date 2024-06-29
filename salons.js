document.addEventListener('DOMContentLoaded', function() {
    const stateSelect = document.getElementById('stateSelect');
    const salonList = document.getElementById('salonList');
    const salonModal = document.getElementById('salonModal');
    const totalResults = document.getElementById('totalResults');

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
        totalResults.textContent = `${filteredSalons.length} salons are in your area`;

        if (filteredSalons.length === 0) {
            salonList.innerHTML = '<p>No salons found in this state.</p>';
        } else {
            filteredSalons.forEach(salon => {
                const salonDiv = document.createElement('div');
                salonDiv.classList.add('salon', 'swiper-slide');
                salonDiv.innerHTML = `
                    <h3 class="salon-name">${salon.Salon}</h3>
                    <p>${salon['Address 1']} ${salon['Address 2'] || ''}</p>
                    <p>${salon.City}, ${salon.State}</p>
                    <p>${salon.Phone}</p>
                `;

                const mapsButton = document.createElement('button');
                mapsButton.textContent = 'Open in Google Maps';
                mapsButton.style.padding = '8px 16px';
                mapsButton.style.fontSize = '14px';
                mapsButton.style.color = 'white';
                mapsButton.style.backgroundColor = 'black';
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
        }

        initializeCarousel();
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
        const swiper = new Swiper('.swiper-container', {
            centeredSlides: true,
            slidesPerView: 'auto',
            spaceBetween: 30,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

    // Accordion on mobile devices
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }
});
