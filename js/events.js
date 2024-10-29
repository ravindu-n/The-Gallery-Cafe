document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("eventModal");
    const span = document.getElementsByClassName("close")[0];

    const eventButtons = document.querySelectorAll(".event-button");
    eventButtons.forEach((button, index) => {
        button.addEventListener("click", function() {
            const eventDetails = [
                {
                    title: "Summer BBQ Night",
                    description: "Join us for an exciting evening of delicious BBQ under the stars!",
                    details: "<strong>Date:</strong> August 15, 2024<br><strong>Table Capacity:</strong> Up to 100 guests<br><strong>Parking Availability:</strong> 50 spots available<br><strong>Special Promotions:</strong> 20% off on all BBQ dishes"
                },
                {
                    title: "Wine Tasting Week",
                    description: "Explore a curated selection of wines paired with our chef's specialties.",
                    details: "<strong>Date:</strong> September 5-10, 2024<br><strong>Table Capacity:</strong> Up to 50 guests<br><strong>Parking Availability:</strong> 30 spots available<br><strong>Special Promotions:</strong> Complimentary wine glass with each ticket"
                }
            ];

            const event = eventDetails[index];
            document.getElementById("modal-title").innerHTML = event.title;
            document.getElementById("modal-description").innerHTML = event.description;
            document.getElementById("modal-details").innerHTML = event.details;

            modal.style.display = "block";
        });
    });

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});
