import React from 'react';

function Attribute({ name, value }) {
    return (
        <div className='col-span-3 flex flex-column justify-between'>
            <span className='px-2 font-semibold text-ellipsis'>{`${name}: `}</span>
            <span className='px-2 font-light'>{value}</span>
        </div>
    );
}

function LongAttribute({ name, value }) {
    return (
        <>
            <span className='col-span-1 px-2 font-semibold text-ellipsis'>{`${name}: `}</span>
            <span className='col-span-8 pr-2 font-light text-justify'>{value}</span>
        </>
    );
}

function Details({ movie, language, translations, publishers, cast }) {

    // Sort language objects by order of attribute
    function sortLanguage(a, b) {
        // language_name | iso639_1
        const sortBy = "language_name";
        return (a[sortBy] > b[sortBy]) ? 1 : ((b[sortBy] > a[sortBy]) ? -1 : 0);
    }

    // 'Minutes' to 'Hours h Minutes m'
    function formatTime(duration) {
        const hours = Math.floor(duration / 60);
        var time = hours > 0 ? hours + "h " : '';
        return time += duration % 60 + "m";
    }

    // 'XXXXXXX' to '$X,XXX,XXX'
    function formatCash(amount) {
        if (amount == null) return '-';
        return '$' + amount.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    // 'YYYY-MM-DD{T}HH:MM:SS' to 'DD/MM/YYYY'
    function formatDate(date) {
        if (date == null) return '-';
        var parts = date.split("T")[0].split('-').reverse();
        return parts.join('/');
    }
    
    const languageString = language == null 
        ? '-' : language.language_name + ` (${language.iso639_1})`;
    const translationStrings = translations.length == 0 
        ? ['-'] : translations.sort(sortLanguage).map(language => language.language_name + ` (${language.iso639_1})`);
    const castStrings = cast.length == 0 
        ? ['-'] : cast.map(actor => actor.first_name + (actor.last_name == null? '' : ` ${actor.last_name}`));
    const publisherStrings = publishers == 0 
        ? ['-'] : publishers.map(publisher => publisher.publishing_company + (publisher.publishing_country == null ? '' : ` (${publisher.publishing_country})`));

    return (
        <div className='grid grid-cols-9 gap-x-2 gap-y-2 bg-stone-800 px-4 py-3 w-full max-h-64 overflow-y-scroll'>
            <Attribute      name="Budget"       value={formatCash(movie.budget)}            />
            <Attribute      name="Adult"        value={movie.adult ? '\u2714' : '\u274C'}   />
            <Attribute      name="Release Date" value={formatDate(movie.release_date)}      />

            <Attribute      name="Revenue"      value={formatCash(movie.revenue)}           />
            <Attribute      name="Language"     value={languageString}                      />
            <Attribute      name="Runtime"      value={formatTime(movie.runtime)}           />

            <LongAttribute  name="Cast"         value={castStrings.join(", ")}              />

            <LongAttribute  name="Translations" value={translationStrings.join(", ")}       />

            <LongAttribute  name="Publishers"   value={publisherStrings.join(", ")}         />
        </div>
    )
}

export default Details;