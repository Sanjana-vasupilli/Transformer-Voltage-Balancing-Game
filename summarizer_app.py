import streamlit as st
import numpy as np
import networkx as nx
from nltk.corpus import stopwords
from nltk.cluster.util import cosine_distance

def read_article(file_contents):
    article = file_contents.split(". ")
    sentences = []
    for sentence in article:
        sentences.append(sentence.replace("[^a-zA-Z]", " ").split(" "))
    sentences.pop()
    return sentences

def sentence_similarity(sent1, sent2, stopwords=None):
    if stopwords is None:
        stopwords = []
    sent1 = [w.lower() for w in sent1]
    sent2 = [w.lower() for w in sent2]
    all_words = list(set(sent1 + sent2))
    vector1 = [0] * len(all_words)
    vector2 = [0] * len(all_words)

    for w in sent1:
        if w in stopwords:
            continue
        vector1[all_words.index(w)] += 1

    for w in sent2:
        if w in stopwords:
            continue
        vector2[all_words.index(w)] += 1

    return 1 - cosine_distance(vector1, vector2)

def gen_sim_matrix(sentences, stopwords):
    similarity_matrix = np.zeros((len(sentences), len(sentences)))
    for idx1 in range(len(sentences)):
        for idx2 in range(len(sentences)):
            if idx1 == idx2:
                continue
            similarity_matrix[idx1][idx2] = sentence_similarity(sentences[idx1], sentences[idx2], stopwords)
    return similarity_matrix

def generate_summary(file_contents, top_n=5):
    from nltk.corpus import stopwords as nltk_stopwords
    stop_words = nltk_stopwords.words('english')
    summarize_text = []
    sentences = read_article(file_contents)
    sentence_similarity_matrix = gen_sim_matrix(sentences, stop_words)
    sentence_similarity_graph = nx.from_numpy_array(sentence_similarity_matrix)
    scores = nx.pagerank(sentence_similarity_graph)
    ranked_sentences = sorted(((scores[i], s) for i, s in enumerate(sentences)), reverse=True)
    top_n = min(top_n, len(ranked_sentences))
    for i in range(top_n):
        summarize_text.append(" ".join(ranked_sentences[i][1]))
    st.write("### Summary:")
    st.write(". ".join(summarize_text) + ".")

st.title("📝 Text Summarizer")
option = st.radio("Choose input method:", ("Upload a file", "Enter text directly"))

if option == "Upload a file":
    uploaded_file = st.file_uploader("Upload a text file", type=["txt"])
    if uploaded_file is not None:
        file_contents = uploaded_file.getvalue().decode("utf-8")
        generate_summary(file_contents, top_n=2)
else:
    input_text = st.text_area("Enter text here:")
    if st.button("Generate Summary"):
        generate_summary(input_text, top_n=2)
