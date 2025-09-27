document.addEventListener('DOMContentLoaded', function() {
    const reminderForm = document.getElementById('reminder-form');
    const remindersContainer = document.getElementById('reminders-container');
    
    // Load reminders from localStorage
    function loadReminders() {
        const reminders = JSON.parse(localStorage.getItem('plantReminders') || "[]");
        displayReminders(reminders);
    }
    
    // Display reminders in the UI
    function displayReminders(reminders) {
        remindersContainer.innerHTML = '';
        
        if (reminders.length === 0) {
            remindersContainer.innerHTML = `
                <div class="empty-reminders">
                    <i class="fas fa-calendar-times"></i>
                    <p>No reminders scheduled yet</p>
                </div>
            `;
            return;
        }
        
        // Sort by date (soonest first)
        reminders.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
        
        reminders.forEach(reminder => {
            const reminderElement = document.createElement('div');
            reminderElement.className = 'reminder-card';
            reminderElement.innerHTML = `
                <div class="reminder-header">
                    <h3>${formatPlantName(reminder.plantType)} - ${formatTreatmentName(reminder.treatmentType)}</h3>
                    <button class="delete-reminder" data-id="${reminder.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="reminder-body">
                    <p><i class="fas fa-calendar-day"></i> ${formatDateTime(reminder.dateTime)}</p>
                    ${reminder.notes ? `<p><i class="fas fa-sticky-note"></i> ${reminder.notes}</p>` : ''}
                </div>
                <div class="reminder-footer">
                    <span class="status ${getStatusClass(reminder.dateTime)}">
                        ${getStatusText(reminder.dateTime)}
                    </span>
                </div>
            `;
            
            // Add delete functionality
            reminderElement.querySelector('.delete-reminder').addEventListener('click', () => {
                deleteReminder(reminder.id);
            });
            
            remindersContainer.appendChild(reminderElement);
        });
    }
    
    // Format plant name for display
    function formatPlantName(plantType) {
        const names = {
            tomato: "Tomato",
            potato: "Potato",
            grape: "Grape",
            corn: "Corn"
        };
        return names[plantType] || plantType;
    }
    
    // Format treatment name for display
    function formatTreatmentName(treatmentType) {
        const names = {
            watering: "Watering",
            fertilizing: "Fertilizing",
            pruning: "Pruning",
            pest_control: "Pest Control",
            fungicide: "Fungicide Application"
        };
        return names[treatmentType] || treatmentType;
    }
    
    // Format date for display
    function formatDateTime(dateTimeStr) {
        const date = new Date(dateTimeStr);
        return date.toLocaleString();
    }
    
    // Get status class for styling
    function getStatusClass(dateTimeStr) {
        const now = new Date();
        const reminderDate = new Date(dateTimeStr);
        
        if (reminderDate < now) {
            return 'overdue';
        } else if ((reminderDate - now) < 86400000) { // Less than 24 hours
            return 'urgent';
        } else {
            return 'upcoming';
        }
    }
    
    // Get status text
    function getStatusText(dateTimeStr) {
        const now = new Date();
        const reminderDate = new Date(dateTimeStr);
        const diffHours = Math.round((reminderDate - now) / (1000 * 60 * 60));
        
        if (reminderDate < now) {
            return 'Overdue';
        } else if (diffHours < 24) {
            return `Due in ${diffHours} hours`;
        } else {
            const diffDays = Math.round(diffHours / 24);
            return `Due in ${diffDays} days`;
        }
    }
    
    // Delete a reminder
    function deleteReminder(id) {
        let reminders = JSON.parse(localStorage.getItem('plantReminders') || "[]");
        reminders = reminders.filter(r => r.id !== id);
        localStorage.setItem('plantReminders', JSON.stringify(reminders));
        displayReminders(reminders);
    }
    
    // Handle form submission
    reminderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const plantType = document.getElementById('plant-type').value;
        const treatmentType = document.getElementById('treatment-type').value;
        const date = document.getElementById('reminder-date').value;
        const time = document.getElementById('reminder-time').value;
        const notes = document.getElementById('reminder-notes').value;
        
        if (!plantType || !treatmentType || !date || !time) {
            alert('Please fill in all required fields');
            return;
        }
        
        const dateTime = `${date}T${time}`;
        
        const newReminder = {
            id: Date.now(),
            plantType,
            treatmentType,
            dateTime,
            notes,
            createdAt: new Date().toISOString()
        };
        
        // Save to localStorage
        let reminders = JSON.parse(localStorage.getItem('plantReminders') || "[]");
        reminders.push(newReminder);
        localStorage.setItem('plantReminders', JSON.stringify(reminders));
        
        // Update UI
        displayReminders(reminders);
        
        // Reset form
        reminderForm.reset();
        
        // Show confirmation
        alert('Reminder added successfully!');
    });
    
    // Initialize
    loadReminders();
});