document.addEventListener('DOMContentLoaded', function () {
    const announcementForm = document.getElementById('announcementform');
    const announcementTableBody = document.getElementById('announcementbody');

    // Function to fetch and display announcements
    function fetchAnnouncements() {
        fetch('/announcements')
            .then(response => response.json())
            .then(data => {
                announcementTableBody.innerHTML = '';
                data.forEach(announcement => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${announcement.id}</td>
                        <td>${announcement.title}</td>
                        <td>${announcement.date_of_arrival}</td>
                        <td>${announcement.description}</td>
                        <td><img src="${announcement.image}" alt="Image" style="width: 100px;"></td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editAnnouncement(${announcement.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteAnnouncement(${announcement.id})">Delete</button>
                        </td>
                    `;
                    announcementTableBody.appendChild(row);
                });
            });
    }

    // Function to create or update an announcement
    announcementForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(announcementForm);
        const id = formData.get('id');
        const url = id ? `/announcements/${id}` : '/announcements';
        const method = id ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        })
        .then(response => response.json())
        .then(data => {
            fetchAnnouncements();
            $('#announcementModal').modal('hide');
        });
    });

    // Function to edit an announcement
    window.editAnnouncement = function (id) {
        fetch(`/announcements/${id}`)
            .then(response => response.json())
            .then(data => {
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        const element = document.getElementById(`${key}_id`);
                        if (element) element.value = data[key];
                    }
                }
                $('#announcementModal').modal('show');
            });
    };

    // Function to delete an announcement
    window.deleteAnnouncement = function (id) {
        fetch(`/announcements/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        })
        .then(response => response.json())
        .then(data => {
            fetchAnnouncements();
        });
    };

    // Initial fetch of announcements
    fetchAnnouncements();
});
