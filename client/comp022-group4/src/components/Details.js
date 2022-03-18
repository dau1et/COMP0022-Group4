import React from 'react';

function Attribute({ name, value }) {
    return (
        <>
            <span className='px-2 font-semibold'>{`${name}: `}</span>
            <span className='px-2 font-light'>{value}</span>
        </>
    );
}

function Details({ movie }) {
    /* We need:
     *  movie language
     *  movie translations
     *  publishing companies
     *  publishing countries
     *  cast
     * 
     * If the final display looks ugly we can have 'more information' button to open a modal
     */

    // 'Minutes' to 'Hours h Minutes m'
    function formatTime(duration) {
        const hours = Math.floor(duration / 60);
        var time = hours > 0 ? hours + "h " : '';
        return time += duration % 60 + "m";
    }

    // 'XXXXXXX' to '$X,XXX,XXX'
    function formatCash(amount) {
        return '$' + amount.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    // 'YYYY-MM-DD{T}HH:MM:SS' to 'DD/MM/YYYY'
    function formatDate(date) {
        var parts = date.split("T")[0].split('-').reverse();
        return parts.join('/');
    }

    return (
        <div className='grid grid-cols-3 gap-x-2 gap-y-1 bg-stone-800 px-4 py-3 w-full'>
            <div className='flex flex-column justify-between'><Attribute name="Budget"        value={formatCash(movie.budget)}       /></div>
            <div className='flex flex-column justify-between'><Attribute name="Adult"         value={'\u274C'}                       /></div>
            <div className='flex flex-column justify-between'><Attribute name="Release Date"  value={formatDate(movie.release_date)} /></div>
        
            <div className='flex flex-column justify-between'><Attribute name="Revenue"       value={formatCash(movie.revenue)}      /></div>
            <div className='flex flex-column justify-between'><Attribute name="Language"      value={"English"}                      /></div>
            <div className='flex flex-column justify-between'><Attribute name="Runtime"       value={formatTime(movie.runtime)}      /></div>
        
            <div className='col-span-3'><Attribute name="Translations"          value={movie.title}/></div>
            <div className='col-span-3'><Attribute name="Publishing Companies"  value={movie.title}/></div>
            <div className='col-span-3'><Attribute name="Publishing Countries"  value={movie.title}/></div>
            <div className='col-span-3'><Attribute name="Cast"                  value={movie.title}/></div>
        </div>
    )
}

export default Details;