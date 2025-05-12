"""Hello unit test module."""

from my_proj.hello import hello


def test_hello():
    """Test the hello function."""
    assert hello() == "Hello my_proj"
