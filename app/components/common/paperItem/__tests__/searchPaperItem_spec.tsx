import { getMissingWords } from '../searchPaperItem';

describe('searchPaperItem component', () => {
  describe('findMissingWords function', () => {
    let sentence: string;
    let source: string;

    beforeEach(() => {
      sentence = '';
      source = '';
    });

    describe('when 1 word is missing', () => {
      it('should return ["orange"]', () => {
        sentence = 'machine learning algorithms improvement orange';
        source =
          'Large-scale machine learning (ML) algorithms are often iterative, using repeated read-only data access and I/O-bound matrix-vector multiplications to converge to an optimal model. It is crucial for performance to fit the data into single-node or distributed main memory. General-purpose, heavy- and lightweight compression techniques struggle to achieve both good compression ratios and fast decompression speed to enable block-wise uncompressed operations. Hence, we initiate work on compressed linear algebra (CLA), in which lightweight database compression techniques are applied to matrices and then linear algebra operations such as matrix-vector multiplication are executed directly on the compressed representations. We contribute effective column compression schemes, cache-conscious operations, and an efficient sampling-based compression algorithm. Our experiments show that CLA achieves in-memory operations performance close to the uncompressed case and good compression ratios that allow us to fit larger datasets into available memory. We thereby obtain significant end-to-end performance improvements up to 26x or reduced memory requirements.';

        expect(getMissingWords(sentence, source)).toEqual(['orange']);
      });
    });

    describe('when one word has different case', () => {
      it('should return ["orange"]', () => {
        sentence = 'Machine learning orange apple';
        source = `In this paper we introduce, the FlashText algorithm for replacing keywords or finding keywords in a given text. FlashText can search or replace keywords in one pass over a document. The time complexity of this algorithm is not dependent on the number of terms being searched or replaced. For a document of size N (characters) and a dictionary of M keywords, the time complexity will be O(N). This algorithm is much faster than Regex, because regex time complexity is O(MxN). It is also different from Aho Corasick Algorithm, as it doesn't match substrings. FlashText is designed to only match complete words (words with boundary characters on both sides). For an input dictionary of {<b>Apple</b>}, this algorithm won't match it to 'I like Pineapple'. This algorithm is also designed to go for the longest match first. For an input dictionary {<b>Machine</b><b>, Learning</b>, <b>Machine</b><b> learning</b>} on a string 'I like <b>Machine</b><b> learning</b>', it will only consider the longest match, which is <b>Machine</b><b> Learning</b>. We have made python implementation of this algorithm available as open-source on GitHub, released under the permissive MIT License.`;

        expect(getMissingWords(sentence, source)).toEqual(['orange']);
      });
    });

    describe('when all words exist', () => {
      it('should return []', () => {
        sentence = 'machine learning algorithms improvement';
        source =
          'Large-scale machine learning (ML) algorithms are often iterative, using repeated read-only data access and I/O-bound matrix-vector multiplications to converge to an optimal model. It is crucial for performance to fit the data into single-node or distributed main memory. General-purpose, heavy- and lightweight compression techniques struggle to achieve both good compression ratios and fast decompression speed to enable block-wise uncompressed operations. Hence, we initiate work on compressed linear algebra (CLA), in which lightweight database compression techniques are applied to matrices and then linear algebra operations such as matrix-vector multiplication are executed directly on the compressed representations. We contribute effective column compression schemes, cache-conscious operations, and an efficient sampling-based compression algorithm. Our experiments show that CLA achieves in-memory operations performance close to the uncompressed case and good compression ratios that allow us to fit larger datasets into available memory. We thereby obtain significant end-to-end performance improvements up to 26x or reduced memory requirements.';

        expect(getMissingWords(sentence, source)).toEqual([]);
      });
    });

    describe('when all words exist but case is different', () => {
      it('should return []', () => {
        sentence = 'MACHINE LEARNING ALGORITHMS IMPROVEMENT';
        source =
          'Large-scale machine learning (ML) algorithms are often iterative, using repeated read-only data access and I/O-bound matrix-vector multiplications to converge to an optimal model. It is crucial for performance to fit the data into single-node or distributed main memory. General-purpose, heavy- and lightweight compression techniques struggle to achieve both good compression ratios and fast decompression speed to enable block-wise uncompressed operations. Hence, we initiate work on compressed linear algebra (CLA), in which lightweight database compression techniques are applied to matrices and then linear algebra operations such as matrix-vector multiplication are executed directly on the compressed representations. We contribute effective column compression schemes, cache-conscious operations, and an efficient sampling-based compression algorithm. Our experiments show that CLA achieves in-memory operations performance close to the uncompressed case and good compression ratios that allow us to fit larger datasets into available memory. We thereby obtain significant end-to-end performance improvements up to 26x or reduced memory requirements.';

        expect(getMissingWords(sentence, source)).toEqual([]);
      });
    });
  });
});
