module.exports = {
    name: 'fancylist',
    aliases: ['fancystyles', 'styles'],
    category: 'text',
    description: 'Show all available fancy text styles',
    usage: '§fancylist',
    async execute(sock, msg, args, extra) {
        const styles = `◆ Fancy Text Styles (1 - 50)
Reply with: §fancy <number> <text>

1. 𝔽𝕒𝕟𝕔𝕪 𝕋𝕖𝕩𝕥
2. 𝖥𝖺𝗇𝖼𝗒 𝖳𝖾𝗑𝗍
3. 𝗙𝗮𝗻𝗰𝘆 𝗧𝗲𝘅𝘁
4. 𝘍𝘢𝘯𝘤𝘺 𝘛𝘦𝘹𝘵
5. 𝙁𝙖𝙣𝙘𝙮 𝙏𝙚𝙭𝙩
6. 𝐅𝐚𝐧𝐜𝐲 𝐓𝐞𝐱𝐭
7. 𝐹𝑎𝑛𝑐𝑦 𝑇𝑒𝑥𝑡
8. 𝑭𝒂𝒏𝒄𝒚 𝑻𝒆𝒙𝒕
9. 𝐹𝒶𝓃𝒸𝓎 𝒯𝑒𝓍𝓉
10. 𝓕𝓪𝓷𝓬𝔂 𝓣𝓮𝔁𝓽
11. 𝔉𝔞𝔫𝔠𝔶 𝔗𝔢𝔵𝔱
12. 𝕱𝖆𝖓𝖈𝖞 𝕿𝖊𝖝𝖙
13. 𝙵𝚊𝚗𝚌𝚢 𝚃𝚎𝚡𝚝
14. Ｆａｎｃｙ Ｔｅｘｔ
15. Fᴀɴᴄʏ Tᴇxᴛ
16. Ⓕⓐⓝⓒⓨ Ⓣⓔⓧⓣ
17. 🅕🅐🅝🅒🅨 🅣🅔🅧🅣
18. 𝔽𝕒𝕟𝕔𝕪 𝕋𝕖𝕩𝕥
19. 🅵🅰🅽🅲🆈 🆃🅴🆇🆃
20. ⒡⒜⒩⒞⒴ ⒯⒠⒳⒯
21. ᶠᵃⁿᶜʸ ᵀᵉˣᵗ
22. Fₐₙcy ₜₑxₜ
23. Ⅎɐuɔʎ ┴ǝxʇ
24. Fáńćӳ Téxt
25. 𝕗𝔸ℕℂ𝕐 𝕥𝔼𝕏𝕋
26. ̷a̷bm ̷c̷̷
27. .a.bm .c..
28. ̲a̲bm ̲c̲̲
29. F↧ncy Ŧéxт
30. ̶a̶bm ̶c̶̶
31. Fαnςγ Τεxτ
32. Ƒąղçվ Tҽ×է
33. ᖴᗩᑎᑕY TE᙭T
34. Ｆａｎｃｙ Ｔｅｘｔ
35. Ⓕⓐⓝⓒⓨ Ⓣⓔⓧⓣ
36. Fᴀɴᴄʏ Tᴇxᴛ
37. 𝐅𝐚𝐧𝐜𝐲 𝐓𝐞𝐱𝐭
38. Fꍏꂚꉓꌩ Tꎇꌚꀎ
39. Fаисy Техт
40. 𝙵𝚊𝚗𝚌𝚢 𝚃𝚎𝚡𝚝
41. 𝔽𝕒𝕟𝕔𝕪 𝕋𝕖𝕩𝕥
42.  🇦 🇧🇲  🇨  
43. Fαπςγ Τεxτ
44. ᶠᵃⁿᶜʸ ᵀᵉˣᵗ
45. 🄵🄰🄽🄲🅈 🅃🄴🅇🅃
46. ʄǟռƈʏ ȶɛӼȶ
47. ̴a̴bm ̴c̴̴
48. Ċȧṁċ̈ Ṗėvṛ
49. ʄǟռƈʏ ȶɛӼȶ
50. fαиcу тєχт`;
        
        await extra.reply(styles);
    }
};