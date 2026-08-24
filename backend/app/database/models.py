from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from sqlalchemy import Text,ForeignKey
from sqlalchemy.orm import relationship
from app.database.db import Base
from sqlalchemy import Text

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)

    workspace_id = Column(
        Integer,
        ForeignKey("workspaces.id")
    )

    file_name = Column(String, nullable=False)

    file_type = Column(String, nullable=False)

    file_path = Column(String, nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

class ExtractedText(Base):
    __tablename__ = "extracted_text"

    id = Column(Integer, primary_key=True, index=True)

    workspace_id = Column(
        Integer,
        ForeignKey("workspaces.id")
    )

    file_id = Column(
        Integer,
        ForeignKey("files.id")
    )

    content = Column(
        Text,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )