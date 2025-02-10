document.addEventListener('DOMContentLoaded', function() {
    const reasonSection = document.querySelector('label[for="reason"]');
    if (reasonSection) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginBottom = '10px';

        const templates = [
            'Cheating: Reason, Date, Admin',
            'Ban Evasion: Reason, Date, Admin, Evidence',
            'Cheater Association: Reason, Date, Admin, Duration',
            'Teaming: Date, Admin, Evidence'
        ];

        templates.forEach(template => {
            const templateButton = document.createElement('button');
            templateButton.textContent = template;
            templateButton.style.display = 'block';
            templateButton.style.marginBottom = '5px';
            templateButton.addEventListener('click', function() {
                useTemplate(template);
            });
            buttonContainer.appendChild(templateButton);
        });

        reasonSection.parentNode.insertBefore(buttonContainer, reasonSection.nextSibling);
    }
});

function useTemplate(template) {
    const banNoteField = document.querySelector('textarea[name="note"]');
    if (banNoteField) {
        banNoteField.value = template;
    }
}