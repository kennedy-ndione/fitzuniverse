import { db } from "../firebase-config.js";

import {
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ===============================
// COLLE ICI LE TABLEAU universities
// ===============================

const universities = [

{
country: "Hongrie",

id: "zju-bachelor",

university: "Zhejiang University",

country: "Chine",

city: "Hangzhou",

image: "hangzhou.jpg",

flag: "cn.svg",

level: "Licence",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#45 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://isinfosys.zju.edu.cn/recruit/login.shtml",

description: "Université chinoise reconnue proposant des bourses complètes aux étudiants internationaux."
},

{
id: "zju-master",

university: "Zhejiang University",

country: "Chine",

city: "Hangzhou",

image: "hangzhou.jpg",

flag: "cn.svg",

level: "Master",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "3 ans",

ranking: "#45 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://isinfosys.zju.edu.cn/recruit/login.shtml",

description: "Programme de Master entièrement financé à Zhejiang University."
},

{
id: "zju-phd",

university: "Zhejiang University",

country: "Chine",

city: "Hangzhou",

image: "hangzhou.jpg",

flag: "cn.svg",

level: "Doctorat",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "3 ans",

ranking: "#45 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://isinfosys.zju.edu.cn/recruit/login.shtml",

description: "Programme de Doctorat entièrement financé à Zhejiang University."
},


{
id: "tsinghua-bachelor",

university: "Tsinghua University",

country: "Chine",

city: "Pékin",

image: "beijing.jpg",

flag: "cn.svg",

level: "Licence",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#20 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://is.tsinghua.edu.cn",

description: "Université d'excellence en Chine proposant des programmes internationaux entièrement financés."
},

{
id: "tsinghua-master",

university: "Tsinghua University",

country: "Chine",

city: "Pékin",

image: "beijing.jpg",

flag: "cn.svg",

level: "Master",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "3 ans",

ranking: "#20 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://is.tsinghua.edu.cn",

description: "Programme de Master entièrement financé à Tsinghua University."
},

{
id: "tsinghua-phd",

university: "Tsinghua University",

country: "Chine",

city: "Pékin",

image: "beijing.jpg",

flag: "cn.svg",

level: "Doctorat",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#20 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://is.tsinghua.edu.cn",

description: "Programme de Doctorat entièrement financé à Tsinghua University."
},

{
id: "peking-bachelor",

university: "Peking University",

country: "Chine",

city: "Pékin",

image: "beijing.jpg",

flag: "cn.svg",

level: "Licence",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#14 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.studyatpku.com",

description: "L'une des meilleures universités d'Asie, offrant des programmes internationaux entièrement financés."
},

{
id: "peking-master",

university: "Peking University",

country: "Chine",

city: "Pékin",

image: "beijing.jpg",

flag: "cn.svg",

level: "Master",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "3 ans",

ranking: "#14 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.studyatpku.com",

description: "Programme de Master entièrement financé à Peking University."
},

{
id: "peking-phd",

university: "Peking University",

country: "Chine",

city: "Pékin",

image: "beijing.jpg",

flag: "cn.svg",

level: "Doctorat",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#14 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.studyatpku.com",

description: "Programme de Doctorat entièrement financé à Peking University."
},

{
id: "fudan-bachelor",

university: "Fudan University",

country: "Chine",

city: "Shanghai",

image: "shanghai.jpg",

flag: "cn.svg",

level: "Licence",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#39 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://iso.fudan.edu.cn",

description: "Université prestigieuse de Shanghai proposant des programmes internationaux entièrement financés."
},

{
id: "fudan-master",

university: "Fudan University",

country: "Chine",

city: "Shanghai",

image: "shanghai.jpg",

flag: "cn.svg",

level: "Master",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "3 ans",

ranking: "#39 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://iso.fudan.edu.cn",

description: "Programme de Master entièrement financé à Fudan University."
},

{
id: "fudan-phd",

university: "Fudan University",

country: "Chine",

city: "Shanghai",

image: "shanghai.jpg",

flag: "cn.svg",

level: "Doctorat",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#39 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://iso.fudan.edu.cn",

description: "Programme de Doctorat entièrement financé à Fudan University."
},

{
id: "sjtu-bachelor",

university: "Shanghai Jiao Tong University",

country: "Chine",

city: "Shanghai",

image: "shanghai.jpg",

flag: "cn.svg",

level: "Licence",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#45 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://apply.sjtu.edu.cn",

description: "Université de renommée mondiale spécialisée en ingénierie, informatique, médecine et sciences."
},

{
id: "sjtu-master",

university: "Shanghai Jiao Tong University",

country: "Chine",

city: "Shanghai",

image: "shanghai.jpg",

flag: "cn.svg",

level: "Master",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "3 ans",

ranking: "#45 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://apply.sjtu.edu.cn",

description: "Programme de Master entièrement financé à Shanghai Jiao Tong University."
},

{
id: "sjtu-phd",

university: "Shanghai Jiao Tong University",

country: "Chine",

city: "Shanghai",

image: "shanghai.jpg",

flag: "cn.svg",

level: "Doctorat",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#45 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://apply.sjtu.edu.cn",

description: "Programme de Doctorat entièrement financé à Shanghai Jiao Tong University."
},

{
id: "nju-bachelor",

university: "Nanjing University",

country: "Chine",

city: "Nankin",

image: "nanjing.jpg",

flag: "cn.svg",

level: "Licence",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#145 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://hwxy.nju.edu.cn",

description: "Université historique de Chine reconnue pour l'excellence de ses programmes internationaux."
},

{
id: "nju-master",

university: "Nanjing University",

country: "Chine",

city: "Nankin",

image: "nanjing.jpg",

flag: "cn.svg",

level: "Master",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "3 ans",

ranking: "#145 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://hwxy.nju.edu.cn",

description: "Programme de Master entièrement financé à Nanjing University."
},

{
id: "nju-phd",

university: "Nanjing University",

country: "Chine",

city: "Nankin",

image: "nanjing.jpg",

flag: "cn.svg",

level: "Doctorat",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#145 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://hwxy.nju.edu.cn",

description: "Programme de Doctorat entièrement financé à Nanjing University."
},

{
id: "whu-bachelor",

university: "Wuhan University",

country: "Chine",

city: "Wuhan",

image: "wuhan.jpg",

flag: "cn.svg",

level: "Licence",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#186 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://admission.whu.edu.cn",

description: "Université chinoise de renommée internationale, réputée pour son magnifique campus et ses programmes destinés aux étudiants internationaux."
},

{
id: "whu-master",

university: "Wuhan University",

country: "Chine",

city: "Wuhan",

image: "wuhan.jpg",

flag: "cn.svg",

level: "Master",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "3 ans",

ranking: "#186 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://admission.whu.edu.cn",

description: "Programme de Master entièrement financé à Wuhan University."
},

{
id: "whu-phd",

university: "Wuhan University",

country: "Chine",

city: "Wuhan",

image: "wuhan.jpg",

flag: "cn.svg",

level: "Doctorat",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#186 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://admission.whu.edu.cn",

description: "Programme de Doctorat entièrement financé à Wuhan University."
},

{
id: "hit-bachelor",

university: "Harbin Institute of Technology",

country: "Chine",

city: "Harbin",

image: "harbin.jpg",

flag: "cn.svg",

level: "Licence",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#252 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://studyathit.hit.edu.cn",

description: "Université d'excellence reconnue mondialement pour ses formations en ingénierie, intelligence artificielle, robotique, informatique et sciences spatiales."
},

{
id: "hit-master",

university: "Harbin Institute of Technology",

country: "Chine",

city: "Harbin",

image: "harbin.jpg",

flag: "cn.svg",

level: "Master",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "3 ans",

ranking: "#252 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://studyathit.hit.edu.cn",

description: "Programme de Master entièrement financé au Harbin Institute of Technology."
},

{
id: "hit-phd",

university: "Harbin Institute of Technology",

country: "Chine",

city: "Harbin",

image: "harbin.jpg",

flag: "cn.svg",

level: "Doctorat",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#252 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://studyathit.hit.edu.cn",

description: "Programme de Doctorat entièrement financé au Harbin Institute of Technology."
},

{
id: "xmu-bachelor",

university: "Xiamen University",

country: "Chine",

city: "Xiamen",

image: "xiamen.jpg",

flag: "cn.svg",

level: "Licence",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#303 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://admissions.xmu.edu.cn",

description: "Fondée en 1921, Xiamen University est une université d'excellence réputée pour son magnifique campus, ses programmes internationaux et son haut niveau de recherche."
},

{
id: "xmu-master",

university: "Xiamen University",

country: "Chine",

city: "Xiamen",

image: "xiamen.jpg",

flag: "cn.svg",

level: "Master",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "3 ans",

ranking: "#303 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://admissions.xmu.edu.cn",

description: "Programme de Master entièrement financé à Xiamen University, ouvert aux étudiants internationaux."
},

{
id: "xmu-phd",

university: "Xiamen University",

country: "Chine",

city: "Xiamen",

image: "xiamen.jpg",

flag: "cn.svg",

level: "Doctorat",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#303 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://admissions.xmu.edu.cn",

description: "Programme de Doctorat entièrement financé à Xiamen University pour les étudiants internationaux."
},

{
id: "ustc-bachelor",

university: "University of Science and Technology of China",

country: "Chine",

city: "Hefei",

image: "hefei.jpg",

flag: "cn.svg",

level: "Licence",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#133 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://isa.ustc.edu.cn",

description: "L'une des meilleures universités de Chine en sciences, intelligence artificielle, informatique, mathématiques et physique, reconnue pour son excellence en recherche."
},

{
id: "ustc-master",

university: "University of Science and Technology of China",

country: "Chine",

city: "Hefei",

image: "hefei.jpg",

flag: "cn.svg",

level: "Master",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "3 ans",

ranking: "#133 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://isa.ustc.edu.cn",

description: "Programme de Master entièrement financé à l'University of Science and Technology of China."
},

{
id: "ustc-phd",

university: "University of Science and Technology of China",

country: "Chine",

city: "Hefei",

image: "hefei.jpg",

flag: "cn.svg",

level: "Doctorat",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#133 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://isa.ustc.edu.cn",

description: "Programme de Doctorat entièrement financé à l'University of Science and Technology of China."
},

{
id: "sysu-bachelor",

university: "Sun Yat-sen University",

country: "Chine",

city: "Guangzhou",

image: "guangzhou.jpg",

flag: "cn.svg",

level: "Licence",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#331 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://iso.sysu.edu.cn",

description: "Grande université de recherche du sud de la Chine, reconnue pour ses formations en médecine, économie, sciences, ingénierie et commerce."
},

{
id: "sysu-master",

university: "Sun Yat-sen University",

country: "Chine",

city: "Guangzhou",

image: "guangzhou.jpg",

flag: "cn.svg",

level: "Master",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "3 ans",

ranking: "#331 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://iso.sysu.edu.cn",

description: "Programme de Master entièrement financé à Sun Yat-sen University."
},

{
id: "sysu-phd",

university: "Sun Yat-sen University",

country: "Chine",

city: "Guangzhou",

image: "guangzhou.jpg",

flag: "cn.svg",

level: "Doctorat",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#331 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://iso.sysu.edu.cn",

description: "Programme de Doctorat entièrement financé à Sun Yat-sen University."
},

{
id: "scu-bachelor",

university: "Sichuan University",

country: "Chine",

city: "Chengdu",

image: "chengdu.jpg",

flag: "cn.svg",

level: "Licence",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#336 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://global.scu.edu.cn",

description: "L'une des plus grandes universités de Chine, reconnue pour l'excellence de ses formations en médecine, ingénierie, sciences et sciences humaines."
},

{
id: "scu-master",

university: "Sichuan University",

country: "Chine",

city: "Chengdu",

image: "chengdu.jpg",

flag: "cn.svg",

level: "Master",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "3 ans",

ranking: "#336 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://global.scu.edu.cn",

description: "Programme de Master entièrement financé à Sichuan University."
},

{
id: "scu-phd",

university: "Sichuan University",

country: "Chine",

city: "Chengdu",

image: "chengdu.jpg",

flag: "cn.svg",

level: "Doctorat",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#336 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://global.scu.edu.cn",

description: "Programme de Doctorat entièrement financé à Sichuan University."
},

{
id: "tju-bachelor",

university: "Tianjin University",

country: "Chine",

city: "Tianjin",

image: "tianjin.jpg",

flag: "cn.svg",

level: "Licence",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#269 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://ciee.tju.edu.cn",

description: "Première université moderne de Chine, reconnue pour ses formations en ingénierie, architecture, sciences et technologies."
},

{
id: "tju-master",

university: "Tianjin University",

country: "Chine",

city: "Tianjin",

image: "tianjin.jpg",

flag: "cn.svg",

level: "Master",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "3 ans",

ranking: "#269 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://ciee.tju.edu.cn",

description: "Programme de Master entièrement financé à Tianjin University."
},

{
id: "tju-phd",

university: "Tianjin University",

country: "Chine",

city: "Tianjin",

image: "tianjin.jpg",

flag: "cn.svg",

level: "Doctorat",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#269 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://ciee.tju.edu.cn",

description: "Programme de Doctorat entièrement financé à Tianjin University."
},

{
id: "tongji-bachelor",

university: "Tongji University",

country: "Chine",

city: "Shanghai",

image: "shanghai.jpg",

flag: "cn.svg",

level: "Licence",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#192 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://study.tongji.edu.cn",

description: "Université de renommée mondiale spécialisée en architecture, génie civil, urbanisme, ingénierie, informatique et sciences appliquées."
},

{
id: "tongji-master",

university: "Tongji University",

country: "Chine",

city: "Shanghai",

image: "shanghai.jpg",

flag: "cn.svg",

level: "Master",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "3 ans",

ranking: "#192 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://study.tongji.edu.cn",

description: "Programme de Master entièrement financé à Tongji University."
},

{
id: "tongji-phd",

university: "Tongji University",

country: "Chine",

city: "Shanghai",

image: "shanghai.jpg",

flag: "cn.svg",

level: "Doctorat",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#192 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://study.tongji.edu.cn",

description: "Programme de Doctorat entièrement financé à Tongji University."
},

{
id: "buaa-bachelor",

university: "Beihang University",

country: "Chine",

city: "Pékin",

image: "beijing.jpg",

flag: "cn.svg",

level: "Licence",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#452 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://is.buaa.edu.cn",

description: "Université d'excellence spécialisée dans l'aéronautique, l'aérospatiale, l'intelligence artificielle, l'informatique et les technologies de pointe."
},

{
id: "buaa-master",

university: "Beihang University",

country: "Chine",

city: "Pékin",

image: "beijing.jpg",

flag: "cn.svg",

level: "Master",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "3 ans",

ranking: "#452 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://is.buaa.edu.cn",

description: "Programme de Master entièrement financé à Beihang University."
},

{
id: "buaa-phd",

university: "Beihang University",

country: "Chine",

city: "Pékin",

image: "beijing.jpg",

flag: "cn.svg",

level: "Doctorat",

scholarship: "Chinese Government Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "15 février 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#452 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://is.buaa.edu.cn",

description: "Programme de Doctorat entièrement financé à Beihang University."
},

{
id: "elte-bachelor",

university: "Eötvös Loránd University",

country: "Hongrie",

city: "Budapest",

image: "budapest.jpg",

flag: "hu.svg",

level: "Licence",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#564 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.elte.hu/en",

description: "L'une des universités les plus prestigieuses de Hongrie, reconnue pour ses formations en informatique, intelligence artificielle, mathématiques, sciences, droit, économie et sciences humaines."
},

{
id: "elte-master",

university: "Eötvös Loránd University",

country: "Hongrie",

city: "Budapest",

image: "budapest.jpg",

flag: "hu.svg",

level: "Master",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "2 ans",

ranking: "#564 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.elte.hu/en",

description: "Programme de Master entièrement financé grâce à la bourse Stipendium Hungaricum."
},

{
id: "elte-phd",

university: "Eötvös Loránd University",

country: "Hongrie",

city: "Budapest",

image: "budapest.jpg",

flag: "hu.svg",

level: "Doctorat",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#564 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.elte.hu/en",

description: "Programme de Doctorat entièrement financé grâce à la bourse Stipendium Hungaricum."
},

{
id: "bme-bachelor",

university: "Budapest University of Technology and Economics",

country: "Hongrie",

city: "Budapest",

image: "budapest.jpg",

flag: "hu.svg",

level: "Licence",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#711-720 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.bme.hu",

description: "Université de référence en ingénierie, informatique, intelligence artificielle, architecture, mathématiques et technologies avancées."
},

{
id: "bme-master",

university: "Budapest University of Technology and Economics",

country: "Hongrie",

city: "Budapest",

image: "budapest.jpg",

flag: "hu.svg",

level: "Master",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "2 ans",

ranking: "#711-720 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.bme.hu",

description: "Programme de Master entièrement financé en ingénierie, informatique et technologies grâce à la bourse Stipendium Hungaricum."
},

{
id: "bme-phd",

university: "Budapest University of Technology and Economics",

country: "Hongrie",

city: "Budapest",

image: "budapest.jpg",

flag: "hu.svg",

level: "Doctorat",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#711-720 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.bme.hu",

description: "Programme de Doctorat entièrement financé destiné aux étudiants souhaitant mener des recherches en ingénierie, informatique, intelligence artificielle et technologies de pointe."
},

{
id: "semmelweis-bachelor",

university: "Semmelweis University",

country: "Hongrie",

city: "Budapest",

image: "budapest.jpg",

flag: "hu.svg",

level: "Licence",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#251-300 mondial (Médecine - QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://semmelweis.hu/english",

description: "Université de renommée internationale spécialisée en médecine, dentisterie, pharmacie, sciences infirmières et sciences de la santé."
},

{
id: "semmelweis-master",

university: "Semmelweis University",

country: "Hongrie",

city: "Budapest",

image: "budapest.jpg",

flag: "hu.svg",

level: "Master",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "2 ans",

ranking: "#251-300 mondial (Médecine - QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://semmelweis.hu/english",

description: "Programme de Master entièrement financé dans les domaines de la santé grâce à la bourse Stipendium Hungaricum."
},

{
id: "semmelweis-phd",

university: "Semmelweis University",

country: "Hongrie",

city: "Budapest",

image: "budapest.jpg",

flag: "hu.svg",

level: "Doctorat",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#251-300 mondial (Médecine - QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://semmelweis.hu/english",

description: "Programme de Doctorat entièrement financé destiné aux futurs chercheurs en médecine, pharmacie, santé publique et sciences biomédicales."
},

{
id: "corvinus-bachelor",

university: "Corvinus University of Budapest",

country: "Hongrie",

city: "Budapest",

image: "budapest.jpg",

flag: "hu.svg",

level: "Licence",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "3 ans",

ranking: "Parmi les meilleures universités de commerce d'Europe centrale",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.uni-corvinus.hu",

description: "Université reconnue pour l'excellence de ses formations en économie, finance, commerce international, management, marketing et relations internationales."
},

{
id: "corvinus-master",

university: "Corvinus University of Budapest",

country: "Hongrie",

city: "Budapest",

image: "budapest.jpg",

flag: "hu.svg",

level: "Master",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "2 ans",

ranking: "Parmi les meilleures universités de commerce d'Europe centrale",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.uni-corvinus.hu",

description: "Programme de Master entièrement financé en finance, économie, gestion, marketing, data analytics et commerce international."
},

{
id: "corvinus-phd",

university: "Corvinus University of Budapest",

country: "Hongrie",

city: "Budapest",

image: "budapest.jpg",

flag: "hu.svg",

level: "Doctorat",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "Parmi les meilleures universités de commerce d'Europe centrale",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.uni-corvinus.hu",

description: "Programme de Doctorat entièrement financé destiné aux futurs chercheurs en économie, management, finance et sciences sociales."
},

{
id: "obuda-bachelor",

university: "Óbuda University",

country: "Hongrie",

city: "Budapest",

image: "budapest.jpg",

flag: "hu.svg",

level: "Licence",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "Université technologique de référence en Hongrie",

status: "Ouverte",

documents: [],

applicationUrl: "https://uni-obuda.hu/en",

description: "Université reconnue pour ses formations en informatique, intelligence artificielle, cybersécurité, ingénierie, robotique et sciences appliquées."
},

{
id: "obuda-master",

university: "Óbuda University",

country: "Hongrie",

city: "Budapest",

image: "budapest.jpg",

flag: "hu.svg",

level: "Master",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "2 ans",

ranking: "Université technologique de référence en Hongrie",

status: "Ouverte",

documents: [],

applicationUrl: "https://uni-obuda.hu/en",

description: "Programme de Master entièrement financé en intelligence artificielle, informatique, ingénierie, data science et technologies avancées."
},

{
id: "obuda-phd",

university: "Óbuda University",

country: "Hongrie",

city: "Budapest",

image: "budapest.jpg",

flag: "hu.svg",

level: "Doctorat",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "Université technologique de référence en Hongrie",

status: "Ouverte",

documents: [],

applicationUrl: "https://uni-obuda.hu/en",

description: "Programme de Doctorat entièrement financé destiné aux chercheurs en intelligence artificielle, informatique, robotique, cybersécurité et ingénierie."
},

{
id: "udebrecen-bachelor",

university: "University of Debrecen",

country: "Hongrie",

city: "Debrecen",

image: "debrecen.jpg",

flag: "hu.svg",

level: "Licence",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#574 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://edu.unideb.hu",

description: "L'une des plus grandes universités de Hongrie, reconnue pour ses formations en médecine, ingénierie, informatique, agriculture, commerce et sciences naturelles."
},

{
id: "udebrecen-master",

university: "University of Debrecen",

country: "Hongrie",

city: "Debrecen",

image: "debrecen.jpg",

flag: "hu.svg",

level: "Master",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "2 ans",

ranking: "#574 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://edu.unideb.hu",

description: "Programme de Master entièrement financé dans des domaines tels que l'intelligence artificielle, l'informatique, les sciences de la santé, l'agriculture et le management."
},

{
id: "udebrecen-phd",

university: "University of Debrecen",

country: "Hongrie",

city: "Debrecen",

image: "debrecen.jpg",

flag: "hu.svg",

level: "Doctorat",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#574 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://edu.unideb.hu",

description: "Programme de Doctorat entièrement financé destiné aux étudiants souhaitant mener des recherches en sciences, médecine, ingénierie, agriculture et technologies."
},

{
id: "uszeged-bachelor",

university: "University of Szeged",

country: "Hongrie",

city: "Szeged",

image: "szeged.jpg",

flag: "hu.svg",

level: "Licence",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#570 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://u-szeged.hu",

description: "Université de renommée internationale offrant des formations en médecine, pharmacie, informatique, intelligence artificielle, ingénierie, droit, économie et sciences naturelles."
},

{
id: "uszeged-master",

university: "University of Szeged",

country: "Hongrie",

city: "Szeged",

image: "szeged.jpg",

flag: "hu.svg",

level: "Master",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "2 ans",

ranking: "#570 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://u-szeged.hu",

description: "Programme de Master entièrement financé en intelligence artificielle, informatique, sciences médicales, ingénierie, économie et sciences."
},

{
id: "uszeged-phd",

university: "University of Szeged",

country: "Hongrie",

city: "Szeged",

image: "szeged.jpg",

flag: "hu.svg",

level: "Doctorat",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#570 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://u-szeged.hu",

description: "Programme de Doctorat entièrement financé destiné aux chercheurs en médecine, informatique, intelligence artificielle, biologie, chimie et ingénierie."
},

{
id: "upecs-bachelor",

university: "University of Pécs",

country: "Hongrie",

city: "Pécs",

image: "pecs.jpg",

flag: "hu.svg",

level: "Licence",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#741-750 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://international.pte.hu",

description: "Université historique proposant des formations en médecine, pharmacie, ingénierie, informatique, économie, droit, arts et sciences humaines."
},

{
id: "upecs-master",

university: "University of Pécs",

country: "Hongrie",

city: "Pécs",

image: "pecs.jpg",

flag: "hu.svg",

level: "Master",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "2 ans",

ranking: "#741-750 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://international.pte.hu",

description: "Programme de Master entièrement financé dans les domaines de l'informatique, de l'ingénierie, de la santé, de l'économie et des sciences sociales."
},

{
id: "upecs-phd",

university: "University of Pécs",

city: "Pécs",

image: "pecs.jpg",

flag: "hu.svg",

level: "Doctorat",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "#741-750 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://international.pte.hu",

description: "Programme de Doctorat entièrement financé destiné aux chercheurs en sciences, santé, ingénierie, informatique, économie et sciences humaines."
},

{
id: "sze-bachelor",

university: "Széchenyi István University",

country: "Hongrie",

city: "Győr",

image: "gyor.jpg",

flag: "hu.svg",

level: "Licence",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "Université reconnue en ingénierie et technologies",

status: "Ouverte",

documents: [],

applicationUrl: "https://international.sze.hu",

description: "Université reconnue pour ses programmes en ingénierie, informatique, intelligence artificielle, automobile, architecture, commerce et sciences économiques."
},

{
id: "sze-master",

university: "Széchenyi István University",

country: "Hongrie",

city: "Győr",

image: "gyor.jpg",

flag: "hu.svg",

level: "Master",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "2 ans",

ranking: "Université reconnue en ingénierie et technologies",

status: "Ouverte",

documents: [],

applicationUrl: "https://international.sze.hu",

description: "Programme de Master entièrement financé en intelligence artificielle, informatique, ingénierie, automobile, management et technologies."
},

{
id: "sze-phd",

university: "Széchenyi István University",

country: "Hongrie",

city: "Győr",

image: "gyor.jpg",

flag: "hu.svg",

level: "Doctorat",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "Université reconnue en ingénierie et technologies",

status: "Ouverte",

documents: [],

applicationUrl: "https://international.sze.hu",

description: "Programme de Doctorat entièrement financé destiné aux chercheurs en ingénierie, intelligence artificielle, informatique, mobilité et sciences appliquées."
},

{
id: "miskolc-bachelor",

university: "University of Miskolc",

country: "Hongrie",

city: "Miskolc",

image: "miskolc.jpg",

flag: "hu.svg",

level: "Licence",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "Université reconnue en ingénierie et sciences appliquées",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.uni-miskolc.hu/en",

description: "Université reconnue pour ses formations en ingénierie, informatique, intelligence artificielle, géologie, matériaux, économie et droit."
},

{
id: "miskolc-master",

university: "University of Miskolc",

country: "Hongrie",

city: "Miskolc",

image: "miskolc.jpg",

flag: "hu.svg",

level: "Master",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "2 ans",

ranking: "Université reconnue en ingénierie et sciences appliquées",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.uni-miskolc.hu/en",

description: "Programme de Master entièrement financé en intelligence artificielle, informatique, ingénierie, matériaux, management et sciences."
},

{
id: "miskolc-phd",

university: "University of Miskolc",

country: "Hongrie",

city: "Miskolc",

image: "miskolc.jpg",

flag: "hu.svg",

level: "Doctorat",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "Université reconnue en ingénierie et sciences appliquées",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.uni-miskolc.hu/en",

description: "Programme de Doctorat entièrement financé destiné aux chercheurs en ingénierie, intelligence artificielle, informatique, géologie, matériaux et sciences appliquées."
},

{
id: "mate-bachelor",

university: "Hungarian University of Agriculture and Life Sciences",

country: "Hongrie",

city: "Gödöllő",

image: "godollo.jpg",

flag: "hu.svg",

level: "Licence",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "Université de référence en agriculture et sciences de la vie",

status: "Ouverte",

documents: [],

applicationUrl: "https://english.uni-mate.hu",

description: "Université spécialisée en agriculture, sciences de la vie, environnement, biotechnologie, sécurité alimentaire, développement durable et médecine vétérinaire."
},

{
id: "mate-master",

university: "Hungarian University of Agriculture and Life Sciences",

country: "Hongrie",

city: "Gödöllő",

image: "godollo.jpg",

flag: "hu.svg",

level: "Master",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "2 ans",

ranking: "Université de référence en agriculture et sciences de la vie",

status: "Ouverte",

documents: [],

applicationUrl: "https://english.uni-mate.hu",

description: "Programme de Master entièrement financé en agriculture, environnement, biotechnologie, alimentation, développement durable et sciences de la vie."
},

{
id: "mate-phd",

university: "Hungarian University of Agriculture and Life Sciences",

country: "Hongrie",

city: "Gödöllő",

image: "godollo.jpg",

flag: "hu.svg",

level: "Doctorat",

scholarship: "Stipendium Hungaricum",

funding: "100 %",

language: "Anglais",

deadline: "15 janvier 2027",

coverage: "Bourse complète (frais de scolarité + logement + allocation mensuelle + assurance)",

duration: "4 ans",

ranking: "Université de référence en agriculture et sciences de la vie",

status: "Ouverte",

documents: [],

applicationUrl: "https://english.uni-mate.hu",

description: "Programme de Doctorat entièrement financé destiné aux chercheurs en agriculture, sciences de la vie, environnement, biotechnologie et développement durable."
},

{
id: "polimi-bachelor",

university: "Politecnico di Milano",

country: "Italie",

city: "Milan",

image: "milan.jpg",

flag: "it.svg",

level: "Licence",

scholarship: "Politecnico di Milano Merit-Based Scholarship",

funding: "Jusqu'à 100 %",

language: "Anglais",

deadline: "À confirmer selon l'année académique",

coverage: "Exonération partielle ou totale des frais de scolarité, avec possibilité d'une allocation selon le programme",

duration: "3 ans",

ranking: "#111 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.polimi.it/en",

description: "Université de renommée mondiale spécialisée en ingénierie, architecture, design, informatique, intelligence artificielle et technologies innovantes."
},

{
id: "polimi-master",

university: "Politecnico di Milano",

country: "Italie",

city: "Milan",

image: "milan.jpg",

flag: "it.svg",

level: "Master",

scholarship: "Politecnico di Milano Merit-Based Scholarship",

funding: "Jusqu'à 100 %",

language: "Anglais",

deadline: "À confirmer selon l'année académique",

coverage: "Exonération partielle ou totale des frais de scolarité, avec possibilité d'une allocation selon le programme",

duration: "2 ans",

ranking: "#111 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.polimi.it/en",

description: "Programme de Master en ingénierie, intelligence artificielle, informatique, cybersécurité, architecture et design."
},

{
id: "polimi-phd",

university: "Politecnico di Milano",

country: "Italie",

city: "Milan",

image: "milan.jpg",

flag: "it.svg",

level: "Doctorat",

scholarship: "Politecnico di Milano PhD Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "À confirmer selon l'appel à candidatures",

coverage: "Financement complet avec allocation de recherche et exonération des frais de scolarité",

duration: "3 ans",

ranking: "#111 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.polimi.it/en/phd",

description: "Programme de Doctorat entièrement financé destiné aux chercheurs en ingénierie, intelligence artificielle, informatique, architecture, énergie et technologies avancées."
},

{
id: "unibo-bachelor",

university: "Università di Bologna",

country: "Italie",

city: "Bologne",

image: "bologna.jpg",

flag: "it.svg",

level: "Licence",

scholarship: "International Talents @Unibo",

funding: "Jusqu'à 100 %",

language: "Italien / Anglais",

deadline: "À confirmer selon l'année académique",

coverage: "Exonération des frais de scolarité avec possibilité de bourse selon le programme.",

duration: "3 ans",

ranking: "#133 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.unibo.it",

description: "Programme de Licence proposé dans de nombreux domaines tels que les sciences, l'ingénierie, l'économie, les lettres et les sciences sociales."
},
{
id: "unibo-master",

university: "Università di Bologna",

country: "Italie",

city: "Bologne",

image: "bologna.jpg",

flag: "it.svg",

level: "Master",

scholarship: "International Talents @Unibo",

funding: "Jusqu'à 100 %",

language: "Anglais / Italien",

deadline: "À confirmer selon l'année académique",

coverage: "Exonération des frais de scolarité avec possibilité de bourse d'excellence.",

duration: "2 ans",

ranking: "#133 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.unibo.it",

description: "Programmes de Master reconnus internationalement en intelligence artificielle, ingénierie, économie, droit, santé, agriculture et sciences."
},
{
id: "unibo-phd",

university: "Università di Bologna",

country: "Italie",

city: "Bologne",

image: "bologna.jpg",

flag: "it.svg",

level: "Doctorat",

scholarship: "Unibo PhD Scholarship",

funding: "100 %",

language: "Anglais / Italien",

deadline: "À confirmer selon l'appel à candidatures",

coverage: "Financement complet avec allocation de recherche et exonération des frais de scolarité.",

duration: "3 ans",

ranking: "#133 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.unibo.it",

description: "Programme doctoral destiné aux chercheurs dans de nombreuses disciplines avec financement compétitif."
},

{
id: "sapienza-bachelor",

university: "Sapienza Università di Roma",

country: "Italie",

city: "Rome",

image: "rome.jpg",

flag: "it.svg",

level: "Licence",

scholarship: "LazioDisco Scholarship",

funding: "Jusqu'à 100 %",

language: "Italien / Anglais",

deadline: "À confirmer selon l'année académique",

coverage: "Exonération des frais de scolarité avec possibilité d'allocation selon les critères d'éligibilité.",

duration: "3 ans",

ranking: "#132 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.uniroma1.it",

description: "Programmes de Licence dans les domaines des sciences, de l'ingénierie, des lettres, de la médecine, de l'économie et des sciences sociales."
},
{
id: "sapienza-master",

university: "Sapienza Università di Roma",

country: "Italie",

city: "Rome",

image: "rome.jpg",

flag: "it.svg",

level: "Master",

scholarship: "LazioDisco Scholarship",

funding: "Jusqu'à 100 %",

language: "Anglais / Italien",

deadline: "À confirmer selon l'année académique",

coverage: "Exonération des frais de scolarité avec possibilité de bourse d'excellence.",

duration: "2 ans",

ranking: "#132 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.uniroma1.it",

description: "Masters internationaux en intelligence artificielle, informatique, ingénierie, économie, architecture, droit, médecine et sciences."
},
{
id: "sapienza-phd",

university: "Sapienza Università di Roma",

country: "Italie",

city: "Rome",

image: "rome.jpg",

flag: "it.svg",

level: "Doctorat",

scholarship: "Sapienza PhD Scholarship",

funding: "100 %",

language: "Anglais / Italien",

deadline: "À confirmer selon l'appel à candidatures",

coverage: "Financement complet avec allocation de recherche et exonération des frais de scolarité.",

duration: "3 ans",

ranking: "#132 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.uniroma1.it",

description: "Programmes doctoraux de haut niveau dans toutes les disciplines avec financement compétitif."
},

{
id: "polito-bachelor",

university: "Politecnico di Torino",

country: "Italie",

city: "Turin",

image: "turin.jpg",

flag: "it.svg",

level: "Licence",

scholarship: "EDISU Piemonte Scholarship",

funding: "Jusqu'à 100 %",

language: "Italien / Anglais",

deadline: "À confirmer selon l'année académique",

coverage: "Exonération des frais de scolarité avec possibilité d'allocation selon les critères d'éligibilité.",

duration: "3 ans",

ranking: "#241 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.polito.it",

description: "Programmes de Licence en ingénierie, architecture, design et technologies innovantes."
},
{
id: "polito-master",

university: "Politecnico di Torino",

country: "Italie",

city: "Turin",

image: "turin.jpg",

flag: "it.svg",

level: "Master",

scholarship: "EDISU Piemonte Scholarship",

funding: "Jusqu'à 100 %",

language: "Anglais / Italien",

deadline: "À confirmer selon l'année académique",

coverage: "Exonération des frais de scolarité avec possibilité de bourse d'excellence.",

duration: "2 ans",

ranking: "#241 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.polito.it",

description: "Masters internationaux en intelligence artificielle, informatique, ingénierie, architecture et innovation."
},
{
id: "polito-phd",

university: "Politecnico di Torino",

country: "Italie",

city: "Turin",

image: "turin.jpg",

flag: "it.svg",

level: "Doctorat",

scholarship: "Polito PhD Scholarship",

funding: "100 %",

language: "Anglais / Italien",

deadline: "À confirmer selon l'appel à candidatures",

coverage: "Financement complet avec allocation de recherche et exonération des frais de scolarité.",

duration: "3 ans",

ranking: "#241 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.polito.it",

description: "Programmes doctoraux en ingénierie, intelligence artificielle, informatique, énergie, architecture et technologies avancées."
},

{
id: "unipi-bachelor",

university: "Università di Pisa",

country: "Italie",

city: "Pise",

image: "pisa.jpg",

flag: "it.svg",

level: "Licence",

scholarship: "DSU Toscana Scholarship",

funding: "Jusqu'à 100 %",

language: "Italien / Anglais",

deadline: "À confirmer selon l'année académique",

coverage: "Exonération des frais de scolarité avec possibilité d'allocation, logement et restauration selon les critères d'éligibilité.",

duration: "3 ans",

ranking: "#343 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.unipi.it",

description: "Programmes de Licence en sciences, informatique, ingénierie, économie, médecine, droit et sciences humaines."
},
{
id: "unipi-master",

university: "Università di Pisa",

country: "Italie",

city: "Pise",

image: "pisa.jpg",

flag: "it.svg",

level: "Master",

scholarship: "DSU Toscana Scholarship",

funding: "Jusqu'à 100 %",

language: "Anglais / Italien",

deadline: "À confirmer selon l'année académique",

coverage: "Exonération des frais de scolarité avec possibilité d'allocation, logement et restauration.",

duration: "2 ans",

ranking: "#343 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.unipi.it",

description: "Masters internationaux en intelligence artificielle, informatique, ingénierie, sciences, économie et technologies avancées."
},
{
id: "unipi-phd",

university: "Università di Pisa",

country: "Italie",

city: "Pise",

image: "pisa.jpg",

flag: "it.svg",

level: "Doctorat",

scholarship: "University of Pisa PhD Scholarship",

funding: "100 %",

language: "Anglais / Italien",

deadline: "À confirmer selon l'appel à candidatures",

coverage: "Financement complet avec allocation de recherche et exonération des frais de scolarité.",

duration: "3 ans",

ranking: "#343 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.unipi.it",

description: "Programmes doctoraux en intelligence artificielle, informatique, ingénierie, physique, mathématiques et autres disciplines de recherche."
},

{
id: "unipd-bachelor",

university: "Università di Padova",

country: "Italie",

city: "Padoue",

image: "padova.jpg",

flag: "it.svg",

level: "Licence",

scholarship: "Veneto Regional Scholarship",

funding: "Jusqu'à 100 %",

language: "Italien / Anglais",

deadline: "À confirmer selon l'année académique",

coverage: "Exonération des frais de scolarité avec possibilité d'allocation, de logement et d'aide à la restauration selon les critères d'éligibilité.",

duration: "3 ans",

ranking: "#233 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.unipd.it",

description: "Programmes de Licence en ingénierie, informatique, sciences, médecine, économie, droit et sciences humaines."
},
{
id: "unipd-master",

university: "Università di Padova",

country: "Italie",

city: "Padoue",

image: "padova.jpg",

flag: "it.svg",

level: "Master",

scholarship: "Veneto Regional Scholarship",

funding: "Jusqu'à 100 %",

language: "Anglais / Italien",

deadline: "À confirmer selon l'année académique",

coverage: "Exonération des frais de scolarité avec possibilité d'allocation, de logement et d'aide à la restauration.",

duration: "2 ans",

ranking: "#233 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.unipd.it",

description: "Masters internationaux en intelligence artificielle, informatique, ingénierie, sciences, économie, biotechnologies et santé."
},
{
id: "unipd-phd",

university: "Università di Padova",

country: "Italie",

city: "Padoue",

image: "padova.jpg",

flag: "it.svg",

level: "Doctorat",

scholarship: "University of Padua PhD Scholarship",

funding: "100 %",

language: "Anglais / Italien",

deadline: "À confirmer selon l'appel à candidatures",

coverage: "Financement complet avec allocation de recherche et exonération des frais de scolarité.",

duration: "3 ans",

ranking: "#233 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.unipd.it",

description: "Programmes doctoraux en intelligence artificielle, ingénierie, informatique, sciences de la vie, médecine, physique et autres disciplines de recherche."
},

{
id: "bocconi-bachelor",

university: "Università Bocconi",

country: "Italie",

city: "Milan",

image: "milan.jpg",

flag: "it.svg",

level: "Licence",

scholarship: "Bocconi Merit Award",

funding: "Jusqu'à 100 %",

language: "Anglais / Italien",

deadline: "À confirmer selon l'année académique",

coverage: "Exonération totale ou partielle des frais de scolarité selon le mérite académique.",

duration: "3 ans",

ranking: "#10 mondial (Business & Management - QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.unibocconi.it",

description: "Programmes de Licence en économie, finance, management, droit, data science et sciences politiques."
},
{
id: "bocconi-master",

university: "Università Bocconi",

country: "Italie",

city: "Milan",

image: "milan.jpg",

flag: "it.svg",

level: "Master",

scholarship: "Bocconi Graduate Merit Award",

funding: "Jusqu'à 100 %",

language: "Anglais / Italien",

deadline: "À confirmer selon l'année académique",

coverage: "Exonération totale ou partielle des frais de scolarité avec possibilité de bourse de mérite.",

duration: "2 ans",

ranking: "#10 mondial (Business & Management - QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.unibocconi.it",

description: "Masters internationaux en finance, management, économie, intelligence artificielle appliquée au business, marketing et data science."
},
{
id: "bocconi-phd",

university: "Università Bocconi",

country: "Italie",

city: "Milan",

image: "milan.jpg",

flag: "it.svg",

level: "Doctorat",

scholarship: "Bocconi PhD Scholarship",

funding: "100 %",

language: "Anglais",

deadline: "À confirmer selon l'appel à candidatures",

coverage: "Financement complet avec allocation de recherche et exonération des frais de scolarité.",

duration: "4 ans",

ranking: "#10 mondial (Business & Management - QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.unibocconi.it",

description: "Programmes doctoraux en économie, finance, management, statistiques et sciences sociales."
},

{
id: "unifi-bachelor",

university: "Università di Firenze",

country: "Italie",

city: "Florence",

image: "florence.jpg",

flag: "it.svg",

level: "Licence",

scholarship: "DSU Toscana Scholarship",

funding: "Jusqu'à 100 %",

language: "Italien / Anglais",

deadline: "À confirmer selon l'année académique",

coverage: "Exonération des frais de scolarité avec possibilité d'allocation, de logement et d'aide à la restauration selon les critères d'éligibilité.",

duration: "3 ans",

ranking: "#358 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.unifi.it",

description: "Programmes de Licence en ingénierie, informatique, médecine, économie, agriculture, droit, sciences et sciences humaines."
},
{
id: "unifi-master",

university: "Università di Firenze",

country: "Italie",

city: "Florence",

image: "florence.jpg",

flag: "it.svg",

level: "Master",

scholarship: "DSU Toscana Scholarship",

funding: "Jusqu'à 100 %",

language: "Anglais / Italien",

deadline: "À confirmer selon l'année académique",

coverage: "Exonération des frais de scolarité avec possibilité d'allocation, de logement et d'aide à la restauration.",

duration: "2 ans",

ranking: "#358 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.unifi.it",

description: "Masters internationaux en intelligence artificielle, informatique, ingénierie, économie, biotechnologies, médecine et sciences."
},
{
id: "unifi-phd",

university: "Università di Firenze",

country: "Italie",

city: "Florence",

image: "florence.jpg",

flag: "it.svg",

level: "Doctorat",

scholarship: "University of Florence PhD Scholarship",

funding: "100 %",

language: "Anglais / Italien",

deadline: "À confirmer selon l'appel à candidatures",

coverage: "Financement complet avec allocation de recherche et exonération des frais de scolarité.",

duration: "3 ans",

ranking: "#358 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.unifi.it",

description: "Programmes doctoraux en ingénierie, informatique, médecine, sciences, agriculture et autres disciplines de recherche."
},

{
id: "unina-bachelor",

university: "Università degli Studi di Napoli Federico II",

country: "Italie",

city: "Naples",

image: "naples.jpg",

flag: "it.svg",

level: "Licence",

scholarship: "Campania Regional Scholarship",

funding: "Jusqu'à 100 %",

language: "Italien / Anglais",

deadline: "À confirmer selon l'année académique",

coverage: "Exonération des frais de scolarité avec possibilité d'allocation, de logement et d'aide à la restauration selon les critères d'éligibilité.",

duration: "3 ans",

ranking: "#347 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.unina.it",

description: "Programmes de Licence en ingénierie, informatique, médecine, sciences, architecture, droit, économie et sciences humaines."
},
{
id: "unina-master",

university: "Università degli Studi di Napoli Federico II",

country: "Italie",

city: "Naples",

image: "naples.jpg",

flag: "it.svg",

level: "Master",

scholarship: "Campania Regional Scholarship",

funding: "Jusqu'à 100 %",

language: "Anglais / Italien",

deadline: "À confirmer selon l'année académique",

coverage: "Exonération des frais de scolarité avec possibilité d'allocation, de logement et d'aide à la restauration.",

duration: "2 ans",

ranking: "#347 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.unina.it",

description: "Masters internationaux en intelligence artificielle, informatique, ingénierie, médecine, sciences, économie et technologies avancées."
},
{
id: "unina-phd",

university: "Università degli Studi di Napoli Federico II",

country: "Italie",

city: "Naples",

image: "naples.jpg",

flag: "it.svg",

level: "Doctorat",

scholarship: "University of Naples Federico II PhD Scholarship",

funding: "100 %",

language: "Anglais / Italien",

deadline: "À confirmer selon l'appel à candidatures",

coverage: "Financement complet avec allocation de recherche et exonération des frais de scolarité.",

duration: "3 ans",

ranking: "#347 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.unina.it",

description: "Programmes doctoraux en ingénierie, informatique, intelligence artificielle, médecine, sciences, architecture et autres disciplines de recherche."
},

{
id: "unitn-bachelor",

university: "Università di Trento",

country: "Italie",

city: "Trente",

image: "trento.jpg",

flag: "it.svg",

level: "Licence",

scholarship: "Opera Universitaria Scholarship",

funding: "Jusqu'à 100 %",

language: "Italien / Anglais",

deadline: "À confirmer selon l'année académique",

coverage: "Exonération des frais de scolarité avec possibilité d'allocation, de logement et d'aide à la restauration selon les critères d'éligibilité.",

duration: "3 ans",

ranking: "#429 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.unitn.it",

description: "Programmes de Licence en informatique, ingénierie, mathématiques, économie, droit, sciences cognitives et sciences."
},
{
id: "unitn-master",

university: "Università di Trento",

country: "Italie",

city: "Trente",

image: "trento.jpg",

flag: "it.svg",

level: "Master",

scholarship: "Opera Universitaria Scholarship",

funding: "Jusqu'à 100 %",

language: "Anglais / Italien",

deadline: "À confirmer selon l'année académique",

coverage: "Exonération des frais de scolarité avec possibilité d'allocation, de logement et d'aide à la restauration.",

duration: "2 ans",

ranking: "#429 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.unitn.it",

description: "Masters internationaux en intelligence artificielle, data science, informatique, ingénierie, économie, mathématiques et sciences."
},
{
id: "unitn-phd",

university: "Università di Trento",

country: "Italie",

city: "Trente",

image: "trento.jpg",

flag: "it.svg",

level: "Doctorat",

scholarship: "University of Trento PhD Scholarship",

funding: "100 %",

language: "Anglais / Italien",

deadline: "À confirmer selon l'appel à candidatures",

coverage: "Financement complet avec allocation de recherche et exonération des frais de scolarité.",

duration: "3 ans",

ranking: "#429 mondial (QS)",

status: "Ouverte",

documents: [],

applicationUrl: "https://www.unitn.it",

description: "Programmes doctoraux en intelligence artificielle, informatique, ingénierie, mathématiques, économie, sciences cognitives et autres disciplines de recherche."
},

];

// ===============================

async function importer() {

for (const university of universities) {

await setDoc(

doc(db, "universities", university.id),

{

...university,

isActive: true

}

);

console.log("Importé :", university.university);

}

alert("Toutes les universités ont été importées !");

}

const runBtn = document.getElementById("runImportBtn");

runBtn.addEventListener("click", () => {

const confirmed = confirm(
`Écraser la collection "universities" avec ${universities.length} université(s) codée(s) en dur dans ce script ? Cette action est irréversible.`
);

if (!confirmed) return;

runBtn.disabled = true;
runBtn.textContent = "Import en cours...";

importer().finally(() => {
runBtn.disabled = false;
runBtn.textContent = "Lancer l'import";
});

});
