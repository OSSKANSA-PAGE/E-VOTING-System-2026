/* =====================================================
   OSSKANSA E-VOTING
   SCRIPT.JS
   ===================================================== */


/* ================= CONFIG ================= */

const STORAGE_KEY = "osskansa_evoting_v1";

const ADMIN_PASSWORD = "BAWAPERUBAHAN11172000";


/* ================= DEFAULT DATA ================= */

const defaultData = {

    totalVoters: 100,

    active: true,

    voted: false,

    votes: [0, 0, 0],

    candidates: [

        {
            number: "01",

            chairman: "Nama Ketua 01",

            vice: "Nama Wakil 01",

            vision:
                "Mewujudkan OSIS yang aktif, kreatif, berintegritas, dan mampu menjadi wadah aspirasi siswa.",

            mission:
                "Meningkatkan kegiatan siswa, memperkuat kekeluargaan, serta membangun lingkungan sekolah yang positif."
        },

        {
            number: "02",

            chairman: "Nama Ketua 02",

            vice: "Nama Wakil 02",

            vision:
                "Menjadikan OSIS sebagai organisasi yang inovatif, disiplin, dan dekat dengan seluruh siswa.",

            mission:
                "Mendorong prestasi, meningkatkan solidaritas, serta menciptakan program kerja yang bermanfaat."
        },

        {
            number: "03",

            chairman: "Nama Ketua 03",

            vice: "Nama Wakil 03",

            vision:
                "Membangun OSIS yang demokratis, bertanggung jawab, dan mampu membawa perubahan positif.",

            mission:
                "Menampung aspirasi siswa, mengembangkan potensi siswa, dan meningkatkan partisipasi dalam kegiatan sekolah."
        },
        
        {
            number: "04",

            chairman: "Nama Ketua 04",

            vice: "Nama Wakil 04",

            vision:
                "Membangun OSIS yang demokratis, bertanggung jawab, dan mampu membawa perubahan positif.",

            mission:
                "Menampung aspirasi siswa, mengembangkan potensi siswa, dan meningkatkan partisipasi dalam kegiatan sekolah."
        }

    ]

};


/* ================= LOAD DATA ================= */

function loadData() {

    const saved =
        localStorage.getItem(STORAGE_KEY);

    if (!saved) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(defaultData)
        );

        return structuredClone(defaultData);
    }

    try {

        return JSON.parse(saved);

    } catch (error) {

        console.error(error);

        return structuredClone(defaultData);
    }
}


let data = loadData();


/* ================= SAVE DATA ================= */

function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}


/* ================= DOM READY ================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderCandidates();

        updateProgress();

        updateElectionStatus();

        updateVotedNotice();

        renderAdmin();

    }
);


/* ================= ESCAPE HTML ================= */

function esc(text) {

    return String(text)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
}


/* ================= RENDER CANDIDATES ================= */

function renderCandidates() {

    const grid =
        document.getElementById("candidateGrid");

    if (!grid) return;

    grid.innerHTML = "";


    data.candidates.forEach(
        (candidate, index) => {

            const card =
                document.createElement("div");

            card.className =
                "candidate-card";


            card.innerHTML = `

                <div class="candidate-number">
                    ${esc(candidate.number)}
                </div>

                <div class="candidate-photo">
                    👤
                </div>

                <h3>
                    ${esc(candidate.chairman)}
                </h3>

                <div class="vice">
                    & ${esc(candidate.vice)}
                </div>


                <div class="info-title">
                    VISI
                </div>

                <div class="info-text">
                    ${esc(candidate.vision)}
                </div>


                <div class="info-title">
                    MISI
                </div>

                <div class="info-text">
                    ${esc(candidate.mission)}
                </div>


                <button
                    class="btn primary vote-button"
                    onclick="openVoteModal(${index})"
                    ${(!data.active || data.voted)
                        ? "disabled"
                        : ""}
                >

                    ${data.voted
                        ? "SUDAH MEMILIH"
                        : data.active
                            ? "PILIH PASANGAN"
                            : "PEMILIHAN DITUTUP"}

                </button>

            `;


            grid.appendChild(card);

        }
    );
}


/* ================= VOTE MODAL ================= */

let selectedCandidateIndex = null;


function openVoteModal(index) {

    if (!data.active) {

        showNotification(
            "Pemilihan sedang ditutup."
        );

        return;
    }


    if (data.voted) {

        showNotification(
            "Anda sudah menggunakan hak suara."
        );

        return;
    }


    selectedCandidateIndex = index;


    const candidate =
        data.candidates[index];


    document.getElementById(
        "selectedCandidate"
    ).innerHTML = `

        <strong>
            PASANGAN ${esc(candidate.number)}
        </strong>

        <br>

        ${esc(candidate.chairman)}
        &
        ${esc(candidate.vice)}

    `;


    document
        .getElementById("voteModal")
        .classList.remove("hidden");
}


function closeVoteModal() {

    selectedCandidateIndex = null;

    document
        .getElementById("voteModal")
        .classList.add("hidden");
}


/* ================= CONFIRM VOTE ================= */

function confirmVote() {

    if (
        selectedCandidateIndex === null
    ) {
        return;
    }


    if (!data.active) {

        closeVoteModal();

        return;
    }


    if (data.voted) {

        closeVoteModal();

        return;
    }


    data.votes[
        selectedCandidateIndex
    ]++;


    data.voted = true;


    saveData();


    closeVoteModal();


    renderCandidates();

    updateProgress();

    updateElectionStatus();

    updateVotedNotice();

    renderAdmin();


    showNotification(
        "Suara berhasil disimpan. Terima kasih!"
    );
}


/* ================= PROGRESS ================= */

function getTotalVotes() {

    return data.votes.reduce(
        (total, vote) =>
            total + vote,
        0
    );
}


function getPercentage() {

    if (data.totalVoters <= 0) {

        return 0;
    }


    const percentage =
        (
            getTotalVotes()
            /
            data.totalVoters
        ) * 100;


    return Math.min(
        100,
        percentage
    );
}


function updateProgress() {

    const totalVotes =
        getTotalVotes();

    const percentage =
        getPercentage();


    document.getElementById(
        "voteCount"
    ).textContent =
        totalVotes;


    document.getElementById(
        "totalVoters"
    ).textContent =
        data.totalVoters;


    document.getElementById(
        "percentage"
    ).textContent =
        Math.round(percentage) + "%";


    document.getElementById(
        "progressFill"
    ).style.width =
        percentage + "%";
}


/* ================= ELECTION STATUS ================= */

function updateElectionStatus() {

    const status =
        document.getElementById(
            "electionStatus"
        );


    if (!status) return;


    if (data.active) {

        status.className =
            "status active";

        status.textContent =
            "● PEMILIHAN SEDANG BERLANGSUNG";

    } else {

        status.className =
            "status closed";

        status.textContent =
            "● PEMILIHAN TELAH DITUTUP";
    }
}


/* ================= VOTED NOTICE ================= */

function updateVotedNotice() {

    const notice =
        document.getElementById(
            "votedNotice"
        );


    if (!notice) return;


    if (data.voted) {

        notice.classList.remove(
            "hidden"
        );

    } else {

        notice.classList.add(
            "hidden"
        );
    }
}


/* ================= NOTIFICATION ================= */

let notificationTimer;


function showNotification(message) {

    const notification =
        document.getElementById(
            "notification"
        );

    const text =
        document.getElementById(
            "notificationText"
        );


    text.textContent =
        message;


    notification.classList.remove(
        "hidden"
    );


    clearTimeout(
        notificationTimer
    );


    notificationTimer =
        setTimeout(
            function () {

                notification.classList.add(
                    "hidden"
                );

            },
            3000
        );
}


/* =====================================================
   ADMIN
   ===================================================== */


/* ================= OPEN LOGIN ================= */

function openLoginModal() {

    document
        .getElementById("loginModal")
        .classList.remove("hidden");


    document
        .getElementById("adminPassword")
        .value = "";


    document
        .getElementById("loginError")
        .textContent = "";
}


function closeLoginModal() {

    document
        .getElementById("loginModal")
        .classList.add("hidden");
}


/* ================= LOGIN ================= */

function loginAdmin() {

    const password =
        document.getElementById(
            "adminPassword"
        ).value;


    if (
        password ===
        ADMIN_PASSWORD
    ) {

        closeLoginModal();


        document
            .getElementById("adminScreen")
            .classList.remove("hidden");


        renderAdmin();


        window.scrollTo({
            top: document
                .getElementById("adminScreen")
                .offsetTop,

            behavior: "smooth"
        });


    } else {

        document
            .getElementById("loginError")
            .textContent =
            "Password admin salah.";
    }
}


/* ================= LOGOUT ================= */

function logoutAdmin() {

    document
        .getElementById("adminScreen")
        .classList.add("hidden");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ================= RENDER ADMIN ================= */

function renderAdmin() {

    const totalVotes =
        getTotalVotes();


    const remaining =
        Math.max(
            0,
            data.totalVoters -
            totalVotes
        );


    const percentage =
        getPercentage();


    const totalElement =
        document.getElementById(
            "adminTotalVoters"
        );


    if (!totalElement) return;


    totalElement.textContent =
        data.totalVoters;


    document.getElementById(
        "adminVotes"
    ).textContent =
        totalVotes;


    document.getElementById(
        "adminRemaining"
    ).textContent =
        remaining;


    document.getElementById(
        "adminPercentage"
    ).textContent =
        Math.round(
            percentage
        ) + "%";


    document.getElementById(
        "adminProgress"
    ).style.width =
        percentage + "%";


    document.getElementById(
        "totalVoterInput"
    ).value =
        data.totalVoters;


    const badge =
        document.getElementById(
            "adminStatusBadge"
        );


    const toggleButton =
        document.getElementById(
            "toggleElectionBtn"
        );


    if (data.active) {

        badge.textContent =
            "AKTIF";

        toggleButton.textContent =
            "Tutup Pemilihan";

        toggleButton.className =
            "btn primary";

    } else {

        badge.textContent =
            "DITUTUP";

        badge.style.background =
            "#fff0f1";

        badge.style.color =
            "#dc3545";

        toggleButton.textContent =
            "Buka Kembali Pemilihan";

        toggleButton.className =
            "btn secondary";
    }


    renderResults();

    renderCandidateEditor();
}


/* ================= RESULTS ================= */

function renderResults() {

    const chart =
        document.getElementById(
            "resultsChart"
        );


    if (!chart) return;


    const totalVotes =
        getTotalVotes();


    chart.innerHTML = "";


    data.candidates.forEach(
        (candidate, index) => {

            const votes =
                data.votes[index];


            let percentage = 0;


            if (totalVotes > 0) {

                percentage =
                    (
                        votes /
                        totalVotes
                    ) * 100;
            }


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "result-item";


            item.innerHTML = `

                <div class="result-header">

                    <span class="result-name">
                        Pasangan
                        ${esc(candidate.number)}
                        —
                        ${esc(candidate.chairman)}
                    </span>

                    <strong>
                        ${votes}
                        suara
                        (${Math.round(percentage)}%)
                    </strong>

                </div>


                <div class="result-bar">

                    <div
                        class="result-fill"
                        style="width:${percentage}%">
                    </div>

                </div>

            `;


            chart.appendChild(item);

        }
    );
}


/* ================= TOGGLE ELECTION ================= */

function toggleElection() {

    data.active =
        !data.active;


    saveData();


    renderCandidates();

    updateElectionStatus();

    renderAdmin();


    if (data.active) {

        showNotification(
            "Pemilihan berhasil dibuka."
        );

    } else {

        showNotification(
            "Pemilihan berhasil ditutup."
        );
    }
}


/* ================= RESET VOTES ================= */

function resetVotes() {

    const confirmReset =
        confirm(
            "Yakin ingin menghapus semua suara?"
        );


    if (!confirmReset) {

        return;
    }


    data.votes =
        data.votes.map(
            () => 0
        );


    data.voted = false;


    saveData();


    renderCandidates();

    updateProgress();

    updateVotedNotice();

    renderAdmin();


    showNotification(
        "Semua suara berhasil direset."
    );
}


/* ================= UPDATE TOTAL VOTERS ================= */

function updateTotalVoters() {

    const input =
        document.getElementById(
            "totalVoterInput"
        );


    const newTotal =
        parseInt(input.value);


    if (
        isNaN(newTotal) ||
        newTotal < 1
    ) {

        showNotification(
            "Jumlah pemilih tidak valid."
        );

        return;
    }


    const votes =
        getTotalVotes();


    if (newTotal < votes) {

        showNotification(
            "Total pemilih tidak boleh lebih kecil dari suara masuk."
        );

        return;
    }


    data.totalVoters =
        newTotal;


    saveData();


    updateProgress();

    renderAdmin();


    showNotification(
        "Jumlah pemilih berhasil diperbarui."
    );
}


/* =====================================================
   CANDIDATE EDITOR
   ===================================================== */

function renderCandidateEditor() {

    const editor =
        document.getElementById(
            "candidateEditor"
        );


    if (!editor) return;


    editor.innerHTML = "";


    data.candidates.forEach(
        (candidate, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "editor-item";


            item.innerHTML = `

                <div class="editor-title">

                    PASANGAN
                    ${esc(candidate.number)}

                </div>


                <div class="editor-grid">

                    <input
                        class="input"
                        id="number-${index}"
                        value="${esc(candidate.number)}"
                        placeholder="Nomor"
                    >


                    <input
                        class="input"
                        id="chairman-${index}"
                        value="${esc(candidate.chairman)}"
                        placeholder="Nama Ketua"
                    >


                    <input
                        class="input"
                        id="vice-${index}"
                        value="${esc(candidate.vice)}"
                        placeholder="Nama Wakil"
                    >

                </div>


                <textarea
                    id="vision-${index}"
                    placeholder="Visi"
                >${esc(candidate.vision)}</textarea>


                <textarea
                    id="mission-${index}"
                    placeholder="Misi"
                >${esc(candidate.mission)}</textarea>


                <button
                    class="btn primary"
                    onclick="saveCandidate(${index})">

                    Simpan Pasangan

                </button>

            `;


            editor.appendChild(item);

        }
    );
}


/* ================= SAVE CANDIDATE ================= */

function saveCandidate(index) {

    const number =
        document.getElementById(
            `number-${index}`
        ).value.trim();


    const chairman =
        document.getElementById(
            `chairman-${index}`
        ).value.trim();


    const vice =
        document.getElementById(
            `vice-${index}`
        ).value.trim();


    const vision =
        document.getElementById(
            `vision-${index}`
        ).value.trim();


    const mission =
        document.getElementById(
            `mission-${index}`
        ).value.trim();


    if (
        !number ||
        !chairman ||
        !vice ||
        !vision ||
        !mission
    ) {

        showNotification(
            "Semua data kandidat harus diisi."
        );

        return;
    }


    data.candidates[index] = {

        number,
        chairman,
        vice,
        vision,
        mission

    };


    saveData();


    renderCandidates();

    renderAdmin();


    showNotification(
        "Data pasangan berhasil disimpan."
    );
}


/* ================= ENTER LOGIN ================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            document
                .getElementById("loginModal")
                ?.classList
                .contains("hidden") === false
        ) {

            loginAdmin();
        }


        if (
            event.key === "Escape"
        ) {

            closeVoteModal();

            closeLoginModal();
        }

    }
);