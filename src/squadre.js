$(document).ready(function () {
    // Carica le squadre
    $.getJSON('squadre.json', function (squadre) {
        squadre.forEach(squadra => {
            $('#teamSelect').append(`<option value="${squadra.idSquadra}">${squadra.nomeSquadra}</option>`);
        });
    });

    // Gestisce la selezione della squadra
    $('#teamSelect').change(function () {
        const selectedTeamId = $(this).val();
        $('#playerSelect').empty().append('<option value="">-- Seleziona un giocatore --</option>').prop('disabled', true);
        $('#careerList').empty();

        if (selectedTeamId) {
            $.getJSON('giocatori.json', function (giocatori) {
                const players = giocatori.filter(g => g.idSquadra == selectedTeamId);
                players.forEach(player => {
                    $('#playerSelect').append(`<option value="${player.idGiocatore}">${player.nomeGiocatore} ${player.cognomeGiocatore}</option>`);
                });
                $('#playerSelect').prop('disabled', false);
            });
        }
    });

    // Gestisce la selezione del giocatore
    $('#playerSelect').change(function () {
        const selectedPlayerId = $(this).val();
        $('#careerList').empty();

        if (selectedPlayerId) {
            $.getJSON('carriera.json', function (carriera) {
                const careerEntries = carriera.filter(c => c.idGiocatore == selectedPlayerId);
                careerEntries.forEach(entry => {
                    $.getJSON('squadre.json', function (squadre) {
                        const team = squadre.find(s => s.idSquadra == entry.idSquadra);
                        $('#careerList').append(`<li>${entry.anno}: Giocato con ${team.nomeSquadra}</li>`);
                    });
                });
            });
        }
    });
});
