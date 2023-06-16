import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';
import { pinecone } from '@/utils/pinecone-client';
import { CustomPDFLoader } from '@/utils/customPDFLoader';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
import { DirectoryLoader, PDFLoader } from 'langchain/document_loaders';
import cheerio from 'cheerio';


/* Name of directory to retrieve your files from */
const filePath = 'docs';

export const run = async () => {

  try {
    /*load raw docs from the all files in the directory */
    const directoryLoader = new DirectoryLoader(filePath, {
      '.pdf': (path) => new CustomPDFLoader(path),
    });

    const loader = new PDFLoader(filePath);
    const rawDocs = await directoryLoader.load();
    // const websiteUrl = 'https://www.example.com';
    // const websiteHtml = await fetch(websiteUrl).then(res => res.text());
    // const websiteText = cheerio.load(websiteHtml).text();

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);
    console.log('split docs', docs);

    console.log('creating vector store...');
    
    /*create and store the embeddings in the vectorStore*/
    const embeddings = new OpenAIEmbeddings();
    const index = (await pinecone).Index(PINECONE_INDEX_NAME);

    //embed the PDF documents
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: PINECONE_NAME_SPACE,
      textKey: 'text',
    });

    // console.log(index);
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

(async () => {
  await run();
  console.log('ingestion complete');
})();


















// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
// import { OpenAIEmbeddings } from 'langchain/embeddings';
// import { PineconeStore } from 'langchain/vectorstores';
// import { pinecone } from '@/utils/pinecone-client';
// import { CustomPDFLoader } from '@/utils/customPDFLoader';
// import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
// import { DirectoryLoader, PDFLoader } from 'langchain/document_loaders';
// // import fs from 'fs';
// // import path from 'path';


// /* Name of directory to retrieve your files from */
// const filePath = 'docs';

// export const run = async () => {
//   try {
//     /*load raw docs from the all files in the directory */
//     const directoryLoader = new DirectoryLoader(filePath, {
//       '.pdf': (path) => new PDFDistLoader(path),
//     });
//     console.log(filePath);

//     // const loader = new PDFLoader(filePath);
//     const rawDocs = await directoryLoader.load();
//     // console.log(rawDocs);

//     // group docs
//     // const groupedDocs = groupDodumentsByYear(rawDocs);
//     // const json = JSON.stringify(Array.from(rawDocs.entries()));
//     // console.log(json);
//     // fs.writeFile('test.json', json);

//     /* Split text into chunks */
//     const textSplitter = new RecursiveCharacterTextSplitter({
//       chunkSize: 1000,
//       chunkOverlap: 200,
//     });

//     const docs = await textSplitter.splitDocuments(rawDocs);
//     console.log('split docs', docs);


//     console.log('creating vector store...');
//     const embeddings = new OpenAIEmbeddings();
//     const index = (await pinecone).Index(PINECONE_INDEX_NAME);

//     console.log(rawDocs[1]);
//     const names = ['A', 'B', 'C'];
//     for( let i = 0; i < 3; i++){
      
//     }


//     // for (const [name, documents] of groupedDocs.entries()) {

//     //   const namespace = `doc-${name}`;
//     //   console.log('namespace', namespace);

//     //   const splitdocs = await textSplitter.splitDocuments(documents);
//     //   console.log('split docs', splitdocs.length);

//     //   const json = JSON.stringify(splitdocs);
//     //   console.log(json);

//       // const chunkSize = 50;

//       // console.log('inserting may take few minuts...');
//       // for (let i = 0; i < docs.length; i += chunkSize) {
//       //   const chunk = docs.slice(i, i + chunkSize);
//       //   console.log('chunk', i, chunk);
//       //   await PineconeStore.fromDocuments(
//       //     index,
//       //     chunk,
//       //     embeddings,
//       //     'text',
//       //     namespace,
//       //   );
//     //   }
//     // }
























    // const directories = fs
    //   .readdirSync('./docs')
    //   .filter((file) => {
    //     return fs.statSync(path.join('./docs', file)).isDirectory();
    //   })
    //   .map((dir) => `./docs/${dir}`); // Add prefix 'docs/' to directory names
    // console.log('directories: ', directories);
    // for (const directory of directories) {
    //   /* Load all PDF files in the directory */
    //   const files = fs
    //     .readdirSync(directory)
    //     .filter((file) => path.extname(file) === '.pdf');

    //   for (const file of files) {
    //     console.log(`Processing file: ${file}`);

    //     /* Load raw docs from the pdf file */
    //     const filePath = path.join(directory, file);
    //     const loader = new PDFLoader(filePath);
    //     const rawDocs = await loader.load();

    //     console.log(rawDocs);

    //     /* Split text into chunks */
    //     const textSplitter = new RecursiveCharacterTextSplitter({
    //       chunkSize: 1000,
    //       chunkOverlap: 200,
    //     });

    //     const docs = await textSplitter.splitDocuments(rawDocs);
    //     console.log('split docs', docs);

    //     console.log('creating vector store...');
    //     /*create and store the embeddings in the vectorStore*/
    //     const embeddings = new OpenAIEmbeddings();
    //     const index = (await pinecone).Index(PINECONE_INDEX_NAME); 
    //     const namespace = path.basename(directory); // use the directory name as the namespace 

    //     //embed the PDF documents

    //     /* Pinecone recommends a limit of 100 vectors per upsert request to avoid errors*/
    //     const chunkSize = 50;
    //     for (let i = 0; i < docs.length; i += chunkSize) {
    //       const chunk = docs.slice(i, i + chunkSize);
    //       console.log('chunk', i, chunk);
    //       await PineconeStore.fromDocuments(
    //         index,
    //         chunk,
    //         embeddings,
    //         'text',
    //         namespace,
    //       );
    //     }

    //     console.log(`File ${file} processed`);
    //   }
    // }

//   } catch (error) {
//     console.log('error', error);
//     throw new Error('Failed to ingest your data');
//   }
// };

// (async () => {
//   await run();
//   console.log('ingestion complete');
// })();


