var currentDate = new Date(2024, 7, 1);
var selectedDate = new Date(currentDate);

function getEvents() {
    var events = localStorage.getItem('events');
    if (events === null) {
        return {};
    } else {
        return JSON.parse(events);
    }
}

function setEvents(events) {
    localStorage.setItem('events', JSON.stringify(events));
}

var events = getEvents();

function updateCalendar() {
    var calendarGrid = document.getElementById('calendar-grid');
    var currentMonth = document.getElementById('current-month');

    currentMonth.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    calendarGrid.innerHTML = "";
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(function(day) {
        var dayHeader = document.createElement('div');
        dayHeader.className = 'day-name';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });

    for (var i = 0; i < firstDay.getDay(); i++) {
        var emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty';
        calendarGrid.appendChild(emptyDiv);
    }

    for (var dayCounter = 1; dayCounter <= lastDay.getDate(); dayCounter++) {
        var dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.textContent = dayCounter;

        var dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${dayCounter}`;

        if (events[dateStr]) {
            var eventDiv = document.createElement('div');
            eventDiv.className = 'event-indicator';
            dayDiv.appendChild(eventDiv);
        }

        if (dayCounter == selectedDate.getDate() && currentDate.getMonth() == selectedDate.getMonth() && currentDate.getFullYear() == selectedDate.getFullYear()) {
            dayDiv.classList.add('selected');
        }

        dayDiv.onclick = (function(dayCounterCopy) {
            return function() {
                selectDate(dayCounterCopy);
            };
        })(dayCounter);

        calendarGrid.appendChild(dayDiv);
    }

    updateEvents();
}

function selectDate(day) {
    selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    updateCalendar();
    updateEvents();
    showModal(); 
}

function updateEvents() {
    var eventList = document.getElementById('events');
    var selectedDateText = document.getElementById('selected-date');
    var dateStr = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;

    selectedDateText.textContent = selectedDate.toDateString();
    eventList.innerHTML = '';

    if (events[dateStr]) {
        events[dateStr].forEach(function(event, index) {
            var eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            eventDiv.textContent = event;

            var deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = function() {
                deleteEvent(dateStr, index);
            };

            eventDiv.appendChild(deleteBtn);
            eventList.appendChild(eventDiv);
        });
    } else {
        var noEventsMessage = document.createElement('p');
        noEventsMessage.textContent = 'No events for this date.';
        eventList.appendChild(noEventsMessage);
    }
}

function deleteEvent(dateStr, eventIndex) {
    events[dateStr].splice(eventIndex, 1);
    if (events[dateStr].length === 0) {
        delete events[dateStr];
    }
    setEvents(events);
    updateCalendar();
    updateEvents();
}

var modal = document.getElementById('add-event-modal');
var closeModal = document.getElementsByClassName('close')[0];

function showModal() {
    modal.style.display = 'block';
}

closeModal.onclick = function() {
    modal.style.display = 'none';
};

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
var addEventButton = document.getElementById('add-event-btn');
addEventButton.addEventListener('click', function() {
    var eventInput = document.getElementById('event-input');
    var dateStr = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;

    if (eventInput.value.trim() !== '') {
        if (!events[dateStr]) {
            events[dateStr] = [];
        }
        events[dateStr].push(eventInput.value);
        setEvents(events);

        eventInput.value = '';
        updateCalendar();
        updateEvents();
        modal.style.display = 'none';
    }
});

updateCalendar();