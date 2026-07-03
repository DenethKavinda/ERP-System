import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import Sidebar from "../../Components/Sidebar";

export default function KnowledgeManager({
    documents = [],
    isDarkMode = false,
}) {
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, reset, processing, errors } = useForm({
        title: "",
        category: "Technical Documentation & Whitepapers",
        type: "pdf",
        description: "",
        web_url: "",
        file_upload: null,
    });

    const handleEditInit = (doc) => {
        setEditingId(doc.id);
        setData({
            title: doc.title,
            category: doc.category,
            type: doc.type,
            description: doc.description || "",
            web_url: ["link", "youtube"].includes(doc.type) ? doc.file_url : "",
            file_upload: null, // Keep null unless updating the file
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            // Emulate PUT over multipart/form-data via POST
            post(`/admin/knowledge-manager/${editingId}`, {
                onSuccess: () => handleCancelEdit(),
                forceFormData: true,
            });
        } else {
            post("/admin/knowledge-manager", {
                onSuccess: () => reset(),
                forceFormData: true,
            });
        }
    };

    return (
        <div
            className={`flex min-h-screen ${isDarkMode ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}
        >
            <Head title="Knowledge base Manager" />
            <Sidebar isDarkMode={isDarkMode} />

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-black tracking-tight">
                            Knowledge Base Repository Console
                        </h1>
                        <p className="text-sm text-slate-500">
                            Publish articles, documents, website guides, or
                            embedded training materials directly to user
                            environments.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div
                            className={`p-6 rounded-xl border h-fit ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                        >
                            <h2 className="text-base font-bold mb-4 uppercase tracking-wider text-orange-500">
                                {editingId
                                    ? "Modify Existing Node Asset"
                                    : "Add Global Knowledge Node"}
                            </h2>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4 text-xs"
                            >
                                <div>
                                    <label className="block font-bold uppercase text-slate-400 mb-1">
                                        Asset Title Name
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full p-2.5 rounded-lg border bg-transparent ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        placeholder="e.g., Enterprise Architecture Walkthrough"
                                    />
                                    {errors.title && (
                                        <span className="text-red-500 block mt-1">
                                            {errors.title}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="block font-bold uppercase text-slate-400 mb-1">
                                        Topic Classification Category
                                    </label>
                                    <select
                                        className={`w-full p-2.5 rounded-lg border dark:bg-slate-800 ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
                                        value={data.category}
                                        onChange={(e) =>
                                            setData("category", e.target.value)
                                        }
                                    >
                                        <option value="Technical Documentation & Whitepapers">
                                            Technical Documentation &
                                            Whitepapers
                                        </option>
                                        <option value="API Integrations & Custom Webhooks">
                                            API Integrations & Custom Webhooks
                                        </option>
                                        <option value="Ecosystem Core Configuration Manuals">
                                            Ecosystem Core Configuration Manuals
                                        </option>
                                        <option value="Video Guides & Training Frameworks">
                                            Video Guides & Training Frameworks
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-bold uppercase text-slate-400 mb-1">
                                        Asset Format Medium Profile Type
                                    </label>
                                    <select
                                        className={`w-full p-2.5 rounded-lg border dark:bg-slate-800 ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
                                        value={data.type}
                                        onChange={(e) => {
                                            setData("type", e.target.value);
                                            setData("web_url", "");
                                            setData("file_upload", null);
                                        }}
                                    >
                                        <option value="pdf">
                                            Adobe PDF File Document
                                        </option>
                                        <option value="text">
                                            Plain Text Manual Article
                                        </option>
                                        <option value="image">
                                            Diagram / Layout Illustration Image
                                        </option>
                                        <option value="link">
                                            External Documentation Web URL Link
                                        </option>
                                        <option value="youtube">
                                            Embedded YouTube Video Frame Guide
                                        </option>
                                    </select>
                                </div>

                                {["pdf", "text", "image"].includes(
                                    data.type,
                                ) ? (
                                    <div>
                                        <label className="block font-bold uppercase text-slate-400 mb-1">
                                            Select Local Storage Asset Document{" "}
                                            {editingId &&
                                                "(Leave empty to keep current file)"}
                                        </label>
                                        <input
                                            type="file"
                                            className="w-full text-slate-400 text-[11px] file:py-1.5 file:px-3 file:mr-2 file:border-0 file:rounded file:bg-orange-500/10 file:text-orange-500 font-bold"
                                            onChange={(e) =>
                                                setData(
                                                    "file_upload",
                                                    e.target.files[0],
                                                )
                                            }
                                        />
                                        {errors.file_upload && (
                                            <span className="text-red-500 block mt-1">
                                                {errors.file_upload}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block font-bold uppercase text-slate-400 mb-1">
                                            {data.type === "youtube"
                                                ? "YouTube Shared Video link URL"
                                                : "External Website Reference link Destination"}
                                        </label>
                                        <input
                                            type="url"
                                            className={`w-full p-2.5 rounded-lg border bg-transparent ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
                                            value={data.web_url}
                                            onChange={(e) =>
                                                setData(
                                                    "web_url",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="https://example.com/target-address"
                                        />
                                        {errors.web_url && (
                                            <span className="text-red-500 block mt-1">
                                                {errors.web_url}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label className="block font-bold uppercase text-slate-400 mb-1">
                                        Abstract Summary Field Overviews
                                    </label>
                                    <textarea
                                        rows="3"
                                        className={`w-full p-2.5 rounded-lg border bg-transparent ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter details regarding item usage parameters..."
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`flex-1 p-3 font-black text-white uppercase tracking-wider rounded-lg transition-colors ${editingId ? "bg-blue-600 hover:bg-blue-700" : "bg-orange-500 hover:bg-orange-600"}`}
                                    >
                                        {editingId
                                            ? "Save Node Modifications"
                                            : "Publish Asset Node"}
                                    </button>
                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="px-3 border border-slate-300 dark:border-slate-600 text-xs font-bold uppercase rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="lg:col-span-2">
                            <div
                                className={`p-6 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                            >
                                <h2 className="text-lg font-bold mb-4">
                                    Active Repository Library (
                                    {documents.length})
                                </h2>
                                {documents.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic py-6 text-center">
                                        Repository currently hollow.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {documents.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className={`p-4 border rounded-xl flex items-center justify-between text-xs gap-4 transition-all ${editingId === doc.id ? "ring-2 ring-blue-500" : ""} ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-100"}`}
                                            >
                                                <div>
                                                    <h3 className="font-black text-sm text-orange-500 flex items-center gap-2">
                                                        <span className="uppercase text-[9px] px-2 py-0.5 rounded-md font-bold bg-slate-500/10 text-slate-400 border border-slate-500/10">
                                                            {doc.type}
                                                        </span>
                                                        {doc.title}
                                                    </h3>
                                                    <p className="text-slate-400 max-w-md truncate mt-0.5">
                                                        {doc.description ||
                                                            "No descriptive overview provided."}
                                                    </p>
                                                    <span className="text-[10px] opacity-60 block mt-1">
                                                        Category:{" "}
                                                        <strong>
                                                            {doc.category}
                                                        </strong>
                                                    </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleEditInit(doc)
                                                        }
                                                        className="text-blue-500 bg-blue-500/10 hover:bg-blue-600 hover:text-white font-bold px-3 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    "Discard this asset?",
                                                                )
                                                            )
                                                                router.delete(
                                                                    `/admin/knowledge-manager/${doc.id}`,
                                                                );
                                                        }}
                                                        className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white font-bold px-3 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        Discard
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
