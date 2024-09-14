import Vector from "vector-object";
import pkg from "natural";
const { TfIdf } = pkg;

export class ItemBasedCollabrativeFiltering {
  constructor(items) {
    this.items = items;
  }
  formatDocument = (docs) => {
    const formattedData = [];
    docs.map((doc) => {
      formattedData.push({
        id: doc._id,
        content: `${doc.name} ${doc.intro} ${doc.category_id.title}  ${doc.description} `,
      });
    });
    return formattedData;
  };

  createVectorsFromDocs = (processedDocs) => {
    const tfidf = new TfIdf();

    processedDocs.forEach((processedDocument) => {
      tfidf.addDocument(processedDocument.content);
    });

    const documentVectors = [];

    for (let i = 0; i < processedDocs.length; i += 1) {
      const processedDocument = processedDocs[i];
      const obj = {};

      const items = tfidf.listTerms(i);

      for (let j = 0; j < items.length; j += 1) {
        const item = items[j];
        obj[item.term] = item.tfidf;
      }

      const documentVector = {
        id: processedDocument.id,
        vector: new Vector(obj),
      };

      documentVectors.push(documentVector);
    }
    return documentVectors;
  };

  calcSimilarities = (docVectors) => {
    const MAX_SIMILAR = 20;
    const MIN_SCORE = 0.2;
    const data = {};

    for (let i = 0; i < docVectors.length; i += 1) {
      const documentVector = docVectors[i];
      const { id } = documentVector;

      data[id] = [];
    }

    for (let i = 0; i < docVectors.length; i += 1) {
      for (let j = 0; j < i; j += 1) {
        const idi = docVectors[i].id;
        const vi = docVectors[i].vector;
        const idj = docVectors[j].id;
        const vj = docVectors[j].vector;

        const similarity = vi.getCosineSimilarity(vj);

        if (similarity > MIN_SCORE) {
          data[idi].push({ id: idj, score: similarity });
          data[idj].push({ id: idi, score: similarity });
        }
      }
    }

    Object.keys(data).forEach((id) => {
      data[id].sort((a, b) => b.score - a.score);

      if (data[id].length > MAX_SIMILAR) {
        data[id] = data[id].slice(0, MAX_SIMILAR);
      }
    });
    return data;
  };

  formatTrainedData = (data) => {
    const result = [];

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const keyValueObject = {
          product_id: key,
          recommendations: data[key],
        };
        result.push(keyValueObject);
      }
    }

    return result;
  };
  getSimilarDocuments = (id) => {
    const formattedData = this.formatDocument(itemData);
    const vectorData = this.createVectorsFromDocs(formattedData);
    const trainedData = this.calcSimilarities(vectorData);
    const formattedtrainedData = this.formatTrainedData(trainedData);
    let similarDocuments = trainedData[id];

    if (similarDocuments === undefined) {
      return [];
    }

    return similarDocuments;
  };

  getTrainedData = (items) => {
    const formattedData = this.formatDocument(items);
    const vectorData = this.createVectorsFromDocs(formattedData);
    const trainedData = this.calcSimilarities(vectorData);
    const formattedtrainedData = this.formatTrainedData(trainedData);
    return formattedtrainedData;
  };
}
