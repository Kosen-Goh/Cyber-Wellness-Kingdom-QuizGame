document.addEventListener("DOMContentLoaded", function () {
    const battlecardContainer = document.getElementById("battlecardContainer");

    battlecardContainer.addEventListener("click", function (event) {
        const card = event.target.closest(".property-card");
        if (card) {
            const battleId = card.dataset.battleId;
            if (battleId) {
                window.location.href = `/battle-details.html?id=${battleId}`;
            }
        }
    });
});
