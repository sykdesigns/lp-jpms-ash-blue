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

        // Determine initial display count based on screen size
        const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
        const initialDisplayCount = isDesktop ? 8 : 3;

        if (filteredSalons.length === 0) {
            salonList.innerHTML = '<p>No salons found in this state.</p>';
        } else {
            filteredSalons.slice(0, initialDisplayCount).forEach(salon => {
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

            if (filteredSalons.length > initialDisplayCount) {
                const seeMoreDiv = document.createElement('div');
                seeMoreDiv.classList.add('see-more');

                const seeMoreContainer = document.createElement('div');
                seeMoreContainer.style.display = 'flex';
                seeMoreContainer.style.justifyContent = 'center';
                seeMoreContainer.style.alignItems = 'center';
                seeMoreContainer.style.width = '100%';
                seeMoreContainer.style.marginTop = '12px';
                
                const seeMoreButton = document.createElement('button');
                seeMoreButton.id = 'seeMoreBtn';
                seeMoreButton.textContent = '+ See All';
                seeMoreButton.style.padding = '8px 16px';
                seeMoreButton.style.fontSize = '14px';
                seeMoreButton.style.color = 'black';
                seeMoreButton.style.backgroundColor = 'white';
                seeMoreButton.style.border = 'none';
                seeMoreButton.style.borderRadius = '4px';
                seeMoreButton.style.cursor = 'pointer';
                seeMoreButton.style.textAlign = 'center';
                
                // Append the button to the container
                seeMoreContainer.appendChild(seeMoreButton);

                // Append the container to the seeMoreDiv
                seeMoreDiv.appendChild(seeMoreContainer);

                // Append the seeMoreDiv to the salonList
                salonList.appendChild(seeMoreDiv);

                seeMoreButton.addEventListener('click', function() {
                    salonList.removeChild(seeMoreDiv);
                    filteredSalons.slice(initialDisplayCount).forEach(salon => {
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
                });

                // seeMoreDiv.appendChild(seeMoreButton);
                // salonList.appendChild(seeMoreDiv);
            }
        }
    }

    function openModal() {
        salonModal.classList.add('open');
    }

    window.closeModal = function() {
        salonModal.classList.remove('open');
    }
});

function openInMaps(address) {
    const mapsUrl = `https://www.google.com/maps?q=${address}`;
    window.open(mapsUrl, '_blank');
}


// accordion on mobile devices

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
